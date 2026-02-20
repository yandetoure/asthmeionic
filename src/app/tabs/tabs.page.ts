import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private toastCtrl: ToastController) { }

  async notImplemented() {
    const toast = await this.toastCtrl.create({
      message: 'Cette fonctionnalité sera bientôt disponible',
      duration: 2000,
      position: 'bottom',
      color: 'medium'
    });
    await toast.present();
  }
}
