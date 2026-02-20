import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { MedicationService } from '../../services/entities/medication.service';
import { EventService } from '../../services/entities/event.service';
import { Medication, CrisisEvent } from '../../models/models';

@Component({
    selector: 'app-crisis-modal',
    templateUrl: './crisis-modal.component.html',
    styleUrls: ['./crisis-modal.component.scss'],
    standalone: false
})
export class CrisisModalComponent implements OnInit {
    crisis: Partial<CrisisEvent> = {
        started_at: new Date().toISOString(),
        severity: 'moderate',
        location: '',
        peak_flow_before: undefined,
        peak_flow_after: undefined,
        notes: '',
        triggers: [],
        cough_level: 0,
        shortness_of_breath: 0,
        wheezing: 0
    };

    availableMedications: Medication[] = [];
    selectedMedications: any[] = [];
    isSubmitting = false;

    constructor(
        private modalCtrl: ModalController,
        private medService: MedicationService,
        private eventService: EventService,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        this.loadMedications();
    }

    loadMedications() {
        this.medService.getAll(true).subscribe(meds => {
            this.availableMedications = meds;
        });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    save() {
        if (!this.crisis.started_at || !this.crisis.severity) {
            this.showToast('Veuillez remplir les champs obligatoires.');
            return;
        }

        this.isSubmitting = true;

        // Prepare medications data for the API
        const medicationsData = this.availableMedications
            .filter(m => this.selectedMedications.includes(m.id))
            .map(m => ({
                medication_id: m.id,
                dose: m.dosage || '1 bouffée'
            }));

        const data: any = {
            ...this.crisis,
            medications: medicationsData
        };

        this.eventService.createCrisis(data).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.showToast('Crise enregistrée avec succès.');
                this.modalCtrl.dismiss(res);
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Error saving crisis:', err);
                this.showToast('Erreur lors de l\'enregistrement.');
            }
        });
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
        toast.present();
    }
}
