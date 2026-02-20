import { Component, OnInit } from '@angular/core';
import { MedicationService } from '../services/entities/medication.service';
import { TreatmentService } from '../services/entities/treatment.service';
import { Medication, DailyTreatment } from '../models/models';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  segment = 'daily';
  selectedDate = new Date();
  medications: Medication[] = [];
  dailyTreatments: DailyTreatment[] = [];
  loading = false;

  constructor(
    private medService: MedicationService,
    private treatmentService: TreatmentService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadMedications();
    this.loadDailyTreatments();
  }

  loadMedications() {
    this.medService.getAll().subscribe(meds => this.medications = meds);
  }

  loadDailyTreatments() {
    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    this.treatmentService.getByDate(formattedDate).subscribe(res => {
      this.dailyTreatments = res.data || res;
    });
  }

  segmentChanged() {
    if (this.segment === 'daily') this.loadDailyTreatments();
    else this.loadMedications();
  }

  changeDate(delta: number) {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + delta));
    this.loadDailyTreatments();
  }

  toggleTaken(item: DailyTreatment) {
    if (item.taken) return;

    this.treatmentService.markTaken(item.id!).subscribe({
      next: (updated) => {
        item.taken = true;
        item.taken_at = updated.taken_at;
        this.showToast('Prise enregistrée !');
      }
    });
  }

  async openAddMedication() {
    const alert = await this.alertCtrl.create({
      header: 'Ajouter un médicament',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nom (ex: Ventoline)' },
        { name: 'dosage', type: 'text', placeholder: 'Dosage (ex: 100µg)' },
        { name: 'frequency', type: 'text', placeholder: 'Fréquence (ex: 2 fois par jour)' }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Ajouter',
          handler: (data) => {
            if (!data.name || !data.dosage) return false;
            this.addMedication(data);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  addMedication(data: any) {
    const med: Medication = {
      ...data,
      type: 'inhaled_corticosteroid', // Default for now
      is_active: true
    };
    this.medService.create(med).subscribe(() => {
      this.loadMedications();
      this.showToast('Médicament ajouté');
    });
  }

  async deleteMedication(med: Medication) {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer ?',
      message: `Voulez-vous vraiment supprimer ${med.name} ?`,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: () => {
            this.medService.delete(med.id!).subscribe(() => {
              this.loadMedications();
              this.showToast('Médicament supprimé');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  formatMedType(type?: string): string {
    if (!type) return 'Autre';
    const mapping: any = {
      'inhaled_corticosteroid': 'CSI (Fond)',
      'short_acting_bronchodilator': 'Bronchodilatateur (Crise)',
      'combination_inhaler': 'Combiné',
      'oral_corticosteroid': 'Corticoïde Oral'
    };
    return mapping[type] || 'Médicament';
  }

  getMedIcon(type?: string): string {
    if (type === 'short_acting_bronchodilator') return 'flash-outline';
    return 'medical-outline';
  }

  getMedColor(type?: string): string {
    if (type === 'short_acting_bronchodilator') return 'danger';
    if (type === 'inhaled_corticosteroid') return 'primary';
    return 'medium';
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    toast.present();
  }
}
