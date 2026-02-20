import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ErVisit, Medication } from '../../models/models';
import { MedicationService } from '../../services/entities/medication.service';
import { EventService } from '../../services/entities/event.service';

@Component({
    selector: 'app-er-modal',
    templateUrl: './er-modal.component.html',
    styleUrls: ['./er-modal.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class ErModalComponent implements OnInit {
    visit: Partial<ErVisit> = {
        visited_at: new Date().toISOString(),
        hospital: '',
        duration_hours: undefined,
        outcome: '',
        peak_flow_on_arrival: undefined,
        peak_flow_on_discharge: undefined,
        oxygen_saturation: undefined,
        notes: ''
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
        if (!this.visit.visited_at || !this.visit.hospital) {
            this.showToast('Veuillez remplir les champs obligatoires.');
            return;
        }

        this.isSubmitting = true;

        const medicationsData = this.availableMedications
            .filter(m => this.selectedMedications.includes(m.id))
            .map(m => ({
                medication_id: m.id,
                dose: m.dosage || '1 dose'
            }));

        const data: any = {
            ...this.visit,
            medications: medicationsData
        };

        this.eventService.createErVisit(data).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.showToast('Visite enregistrée avec succès.');
                this.modalCtrl.dismiss(res);
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Error saving ER visit:', err);
                this.showToast('Erreur lors de l\'enregistrement.');
            }
        });
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
        toast.present();
    }
}
