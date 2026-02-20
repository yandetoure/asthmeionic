import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { CrisisEvent, ErVisit, Hospitalization, SymptomLog } from '../models/models';
import { EventService } from '../services/entities/event.service';
import { SymptomLogService } from '../services/entities/symptom-log.service';
import { CrisisModalComponent } from './crisis-modal/crisis-modal.component';
import { SymptomModalComponent } from '../tab1/symptom-modal/symptom-modal.component';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  segment = 'crises';
  crises: CrisisEvent[] = [];
  erVisits: ErVisit[] = [];
  hospitalizations: Hospitalization[] = [];
  logs: SymptomLog[] = [];

  constructor(
    private eventService: EventService,
    private symptomService: SymptomLogService,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.segment === 'crises') {
      this.eventService.getCrises().subscribe(res => this.crises = res.data || res);
    } else if (this.segment === 'er') {
      this.eventService.getErVisits().subscribe(res => this.erVisits = res.data || res);
    } else if (this.segment === 'hospital') {
      this.eventService.getHospitalizations().subscribe(res => this.hospitalizations = res.data || res);
    } else if (this.segment === 'journal') {
      this.symptomService.getAll().subscribe(res => this.logs = res.data || res);
    }
  }

  segmentChanged() {
    this.loadData();
  }

  async openCrisisModal() {
    const modal = await this.modalCtrl.create({
      component: CrisisModalComponent,
      cssClass: 'custom-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadData();
    }
  }

  async openSymptomModal() {
    const modal = await this.modalCtrl.create({
      component: SymptomModalComponent,
      cssClass: 'custom-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadData();
    }
  }

  async addEvent() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Enregistrer quel type d\'événement ?',
      buttons: [
        {
          text: 'Nouvelle Crise',
          icon: 'pulse-outline',
          handler: () => {
            this.openCrisisModal();
          }
        },
        {
          text: 'Visite aux Urgences',
          icon: 'medkit-outline',
          handler: () => {
            this.showToast('Fonctionnalité ajout urgences bientôt disponible');
          }
        },
        {
          text: 'Hospitalisation',
          icon: 'bed-outline',
          handler: () => {
            this.showToast('Fonctionnalité ajout hôpital bientôt disponible');
          }
        },
        {
          text: 'Journal Symptômes',
          icon: 'create-outline',
          handler: () => {
            this.openSymptomModal();
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  formatSeverity(sev: string): string {
    const map: any = {
      'mild': 'Légère',
      'moderate': 'Modérée',
      'severe': 'Grave',
      'life_threatening': 'CRITIQUE'
    };
    return map[sev] || sev;
  }

  getSeverityColor(sev: string): string {
    if (sev === 'mild') return 'primary';
    if (sev === 'moderate') return 'warning';
    return 'danger';
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    toast.present();
  }
}
