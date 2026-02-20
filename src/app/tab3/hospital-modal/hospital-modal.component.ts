import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Hospitalization, Medication } from '../../models/models';
import { MedicationService } from '../../services/entities/medication.service';
import { EventService } from '../../services/entities/event.service';

@Component({
    selector: 'app-hospital-modal',
    templateUrl: './hospital-modal.component.html',
    styleUrls: ['./hospital-modal.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class HospitalModalComponent implements OnInit {
    hospitalization: Partial<Hospitalization> = {
        admission_date: new Date().toISOString(),
        discharge_date: undefined,
        hospital: '',
        diagnosis: '',
        ward: '',
        peak_flow_on_admission: undefined,
        peak_flow_on_discharge: undefined,
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
        if (!this.hospitalization.admission_date || !this.hospitalization.hospital) {
            this.showToast('Veuillez remplir les champs obligatoires.');
            return;
        }

        this.isSubmitting = true;

        const treatmentsData = this.availableMedications
            .filter(m => this.selectedMedications.includes(m.id))
            .map(m => ({
                medication_id: m.id,
                dose: m.dosage || '1 dose',
                frequency: 'pendant l\'hospitalisation'
            }));

        const data: any = {
            ...this.hospitalization,
            treatments: treatmentsData,
            admission_date: typeof this.hospitalization.admission_date === 'string' ? this.hospitalization.admission_date.split('T')[0] : this.hospitalization.admission_date,
            discharge_date: typeof this.hospitalization.discharge_date === 'string' ? this.hospitalization.discharge_date.split('T')[0] : this.hospitalization.discharge_date,
        };

        this.eventService.createHospitalization(data).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.showToast('Hospitalisation enregistrée avec succès.');
                this.modalCtrl.dismiss(res);
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Error saving hospitalization:', err);
                this.showToast('Erreur lors de l\'enregistrement.');
            }
        });
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
        toast.present();
    }
}
