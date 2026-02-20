import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { SymptomLogService } from '../../services/entities/symptom-log.service';
import { SymptomLog } from '../../models/models';

@Component({
    selector: 'app-symptom-modal',
    templateUrl: './symptom-modal.component.html',
    styleUrls: ['./symptom-modal.component.scss'],
    standalone: false
})
export class SymptomModalComponent implements OnInit {
    log: Partial<SymptomLog> = {
        date: new Date().toISOString(),
        cough_level: 0,
        shortness_of_breath: 0,
        wheezing: 0,
        night_awakenings: 0,
        peak_flow: undefined,
        act_score: undefined,
        used_rescue_inhaler: false,
        rescue_inhaler_puffs: 0,
        notes: ''
    };

    isSubmitting = false;

    constructor(
        private modalCtrl: ModalController,
        private symptomService: SymptomLogService,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() { }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    save() {
        this.isSubmitting = true;

        // Ensure numeric values
        const data = {
            ...this.log,
            date: typeof this.log.date === 'string' ? this.log.date.split('T')[0] : this.log.date
        };

        this.symptomService.create(data).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.showToast('Journal mis à jour.');
                this.modalCtrl.dismiss(res);
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Error saving symptoms:', err);
                this.showToast('Erreur lors de l\'enregistrement.');
            }
        });
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
        toast.present();
    }
}
