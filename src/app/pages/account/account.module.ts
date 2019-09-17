import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AccountPage } from './account.page';
import { Camera } from '@ionic-native/camera/ngx';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import { Base64 } from '@ionic-native/base64/ngx';

const routes: Routes = [
  { path: '', component: AccountPage },
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    
    RouterModule.forChild(routes)
  ],
  declarations: [AccountPage],
  providers: [
    Camera,
    // ImagePicker,
    // Base64
  ],
  exports: [],
  entryComponents: []
})
export class AccountPageModule { }
