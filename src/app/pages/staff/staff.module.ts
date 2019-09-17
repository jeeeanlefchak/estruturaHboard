import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuComponentModule } from 'src/app/components/menu/menu.component';
import { StaffPage } from './staff.page';
import { PersonService } from 'src/app/services/person.service';
import { PlayerPositionOccupationService } from 'src/app/services/player-position-occupation.service';
import { PlayerPositionService } from 'src/app/services/player-position.service';

const routes: Routes = [
  {
    path: '',
    component: StaffPage
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
  declarations: [StaffPage],
  providers: [
    PersonService,
    PlayerPositionOccupationService,
    PlayerPositionService
  ],
  exports: []
})
export class StaffPageModule { }
