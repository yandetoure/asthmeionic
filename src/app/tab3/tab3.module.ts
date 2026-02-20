import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { CrisisModalComponent } from './crisis-modal/crisis-modal.component';
import { SymptomModalComponent } from '../tab1/symptom-modal/symptom-modal.component';
import { ErModalComponent } from './er-modal/er-modal.component';
import { HospitalModalComponent } from './hospital-modal/hospital-modal.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    CrisisModalComponent,
    SymptomModalComponent,
    ErModalComponent,
    HospitalModalComponent
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule { }
