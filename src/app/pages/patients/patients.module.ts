import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PatientsPage } from './patients.page';
import { PlayerService } from 'src/app/services/player.service';
import { PatientService } from 'src/app/services/patient.service';
import { MenuComponentModule } from 'src/app/components/menu/menu.component';
import { PlayerPositionOccupationService } from 'src/app/services/player-position-occupation.service';
import { CareTransferService } from 'src/app/services/careTransfer.service';
import { CareTransferItemsService } from 'src/app/services/care-transfer-item.service';
import { PlayerPositionService } from 'src/app/services/player-position.service';
import { PersonService } from 'src/app/services/person.service';
import { PlayerPositionToPlayerPositionService } from 'src/app/services/player-position-to-player-position.service';

const routes: Routes = [
  { path: '', component: PatientsPage }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MenuComponentModule,
  ],
  declarations: [PatientsPage],
  providers: [
    PlayerService,
    PatientService,
    PlayerPositionOccupationService,
    CareTransferService,
    CareTransferItemsService,
    PlayerPositionService,
    PersonService,
    PlayerPositionToPlayerPositionService
  ],
  exports:[],
  entryComponents:[]
})
export class PatientsPageModule {}
