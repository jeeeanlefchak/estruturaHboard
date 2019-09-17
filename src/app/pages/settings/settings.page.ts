import { Component, Inject } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ModalController } from "@ionic/angular";
import { ModalInstitutionPage } from "src/app/modals/modal-institution/modal-institution.page";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})

export class SettingsPage {

    constructor(@Inject('configurations') private storgeConfigurations: Storage, private modalControler: ModalController) { }

    clickResetConnection() {
        this.storgeConfigurations.set("connServer", null)
    }

    async openModalInstitution() {
        let modal = await this.modalControler.create({
            component: ModalInstitutionPage,
            componentProps: {
                institutions: null
            }
        });
        await modal.present();
    }
}