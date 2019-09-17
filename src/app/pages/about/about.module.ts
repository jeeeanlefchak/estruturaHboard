import { Routes, RouterModule } from "@angular/router";
import { AboutPage } from "./about.page";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

const routes: Routes = [
    {
      path: '',
      component: AboutPage
    }
  ];

  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      RouterModule.forChild(routes)
    ],
    declarations: [AboutPage]
  })
  export class AboutPageModule {}