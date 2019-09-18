import { AuthenticationService } from './services/authentication.service';
import { Component, OnInit, Inject } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { ModalInstitutionPage } from './modals/modal-institution/modal-institution.page';
import { Storage } from '@ionic/storage';
import { InstitutionService } from './services/institution.service';
import { EventService } from './services/shared/EventsService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: []
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthenticationService,
    private router: Router,
    private modalControler: ModalController,
    @Inject('configurations') private storgeConfigurations: Storage,
    private institutionService: InstitutionService
  ) { }

  ngOnInit() {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#E9E9Ef');
      this.splashScreen.hide();
      this.auth.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['tabs/patients']);
          this.checkInstitutionAndSector();
        } else {
          this.auth.checkToken().then(res => {
            if (res) {
              this.router.navigate(['tabs/patients']);
            } else {
              this.router.navigate(['/login']);
            }
          },error=>{
            this.router.navigate(['/login']);
          });
        }
      });
    });
  }

  async checkInstitutionAndSector() {
    let institution, sector;
    await this.storgeConfigurations.get('currentSector').then(res => {
      sector = res;
    })
    await this.storgeConfigurations.get('currentInstitution').then(res => {
      institution = res;
    });
    if (!institution && !sector) this.openModalInstitution()
  }

  async  openModalInstitution() {
    let institutions, user;
    await this.auth.loggedUser.subscribe((res) => {
      user = res;
    });
    await this.institutionService.getByOwner(user.ownerId, user.ownerType).then(res => {
      institutions = this.aggrupation(res);
    }, error => {

    })

    if (institutions) {
      if (institutions.length == 1 && institutions[0].arraySector.length == 1) {
        await this.institutionService.saveLocal(institutions[0], institutions[0].arraySector[0]);
        await EventService.get('updateTitleInstitutionAndSector').emit(institutions);
        return
      }
    }
    let modal = await this.modalControler.create({
      component: ModalInstitutionPage,
      componentProps: {
        institutions: institutions
      }
    });
    await modal.present();
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

}
