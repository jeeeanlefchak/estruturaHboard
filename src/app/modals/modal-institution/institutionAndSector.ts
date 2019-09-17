import { Storage } from "@ionic/storage";
import { Inject } from "@angular/core";

export class InstitutionAndSector {
    public institutionAndSector: string = '';
    constructor(@Inject('configurations') protected storgeConfigurations: Storage) {
        this.mountStringInstitutionSector();
    }

    protected async mountStringInstitutionSector() {
        let mountString = '';
        await this.storgeConfigurations.get('currentInstitution').then(institution => {
            if (institution) mountString = institution.name;
        });
        await this.storgeConfigurations.get('currentSector').then(sector => {
            if (sector) mountString += ' | ' + sector.name;
        });

        this.institutionAndSector = mountString;
    }
}