import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlayerService } from 'src/app/services/player.service';
import { CareTransferService } from 'src/app/services/careTransfer.service';
import { CareTransferItemsService } from 'src/app/services/care-transfer-item.service';
import { HandoffComponent } from './handoff.component';
import { PlayerPositionService } from 'src/app/services/player-position.service';

const routes: Routes = [
  { path: '', component: HandoffComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HandoffComponent],
  providers: [
    PlayerService,
    CareTransferService,
    CareTransferItemsService,
    PlayerPositionService
  ],
  exports: [],
  entryComponents: []
})
export class HandoffModule { }
