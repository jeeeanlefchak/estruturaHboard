import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PersonService } from 'src/app/services/person.service';
import { AdmissionComponent } from './admission.component';
import { PlayerPositionService } from 'src/app/services/player-position.service';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/File/ngx';

const routes: Routes = [
  { path: '', component: AdmissionComponent },
  { path: ':id', component: AdmissionComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [AdmissionComponent],
  providers: [
    PersonService,
    PlayerPositionService,
    PersonService,
    FileTransfer,
    DocumentViewer,
    File
  ],
  exports: [],
  entryComponents: []
})
export class AdmissionPageModule { }
