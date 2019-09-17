import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OccupationsPage } from './occupations.page';
import { PlayerService } from 'src/app/services/player.service';
import { PlayerToGroupService } from 'src/app/services/player-to-group.service';
import { MenuComponentModule } from 'src/app/components/menu/menu.component';
import { SharedDataService } from 'src/app/services/shared/sharedDate.service';
import { PlayerPositionOccupationService } from 'src/app/services/player-position-occupation.service';
import { PlayerPositionStationService } from 'src/app/services/player-position-station.service';
import { PlayerPositionService } from 'src/app/services/player-position.service';

const routes: Routes = [
  {
    path: '',
    component: OccupationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MenuComponentModule
  ],
  declarations: [OccupationsPage],
  providers: [
    PlayerService,
    PlayerToGroupService,
    SharedDataService,
    PlayerPositionOccupationService,
    PlayerPositionStationService,
    PlayerPositionService
  ],
  exports: []
})
export class OccupationsPageModule { }
