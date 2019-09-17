import { Component, OnInit, Input } from '@angular/core';
import { AuthenticateUser } from 'src/app/models/authenticate-user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Sector } from 'src/app/models/sector';
import { Institution } from 'src/app/models/institution';
import { InstitutionService } from 'src/app/services/institution.service';
import { SectorService } from 'src/app/services/sector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/shared/EventsService';

@Component({
  selector: 'app-modal-institution',
  templateUrl: './modal-institution.page.html',
  styleUrls: ['./modal-institution.page.scss'],
})
export class ModalInstitutionPage implements OnInit {
  signinForm: FormGroup;
  @Input() institutions: any[];
  public sectores;

  constructor(private auth: AuthenticationService, private modalCtrl: ModalController,
    private institutionService: InstitutionService, public formBuilder: FormBuilder) { }

  async ngOnInit() {
    this.signinForm = this.formBuilder.group({
      institution: ['', Validators.compose([Validators.required])],
      sector: ['', [Validators.required]],
    });

    if (!this.institutions) await this.getInstitutions();
    console.log("institutionsAndSector", this.institutions)
    if (this.institutions) {
      if (this.institutions.length > 0) {
        this.signinForm.get('institution').setValue(this.institutions[0]);
        if(this.institutions[0].arraySector){
          if(this.institutions[0].arraySector.length > 0){
            this.signinForm.get('sector').setValue(this.institutions[0].arraySector[0]);
          }
          this.sectores = this.institutions[0].arraySector;
        }
      }
    }
  }

  async getInstitutions() {
    let user;
    await this.auth.loggedUser.subscribe((res) => {
      user = res;
    });
    await this.institutionService.getByOwner(user.ownerId, user.ownerType).then(res => {
      this.institutions = this.aggrupation(res);
    }, error => {

    })
  }

  aggrupation(data) {
    let array: any[] = [];
    data.forEach(institution => {
      let item = array.find(x => x.id == institution.id);
      if (item) {
        if (item['arraySector']) {
          item['arraySector'].push(institution.sector);
        }
      } else {
        if (!institution['arraySector']) institution['arraySector'] = [];
        institution['arraySector'].push(institution.sector);
        array.push(institution);
      }
    });

    return array
  }

  async onSubmit() {
    let institution = this.signinForm.value.institution;
    delete institution.arraySector;
    delete institution.sector;
    await this.institutionService.saveLocal(institution, this.signinForm.value.sector);
    EventService.get('updateTitleInstitutionAndSector').emit(institution);
    await this.close();
  }

  selectedInstitution(value) {
    console.log(value.detail.value.arraySector);
    this.sectores = value.detail.value.arraySector;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
