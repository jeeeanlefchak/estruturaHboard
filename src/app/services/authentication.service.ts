import { AuthenticateUser } from './../models/authenticate-user';
import { User } from './../models/user';
import { SecurityService } from './security.service';
import { Platform, ToastController } from '@ionic/angular';
import { Injectable, Inject } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { LoadingController } from '@ionic/angular';
import { EventService } from './shared/EventsService';
import { Router } from '@angular/router';
import { PlayerService } from './player.service';
import { PersonService } from './person.service';
import { Person } from '../models/person';

const TOKEN_KEY = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);
  loggedUser = new BehaviorSubject(undefined);
  loading: any;

  constructor(
    public toastController: ToastController,
    private plt: Platform,
    private securityService: SecurityService,
    private tokenService: TokenService,
    public loadingController: LoadingController,
    @Inject('configurations') private storgeConfigurations: Storage,
    private router: Router,
    @Inject('boards') private storageBoard: Storage,
    private playerService: PlayerService,
    private personService: PersonService,
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    return new Promise<any>((resolve, reject) => {
      this.storgeConfigurations.get(TOKEN_KEY).then(res => {
        if (res) {
          let token = this.tokenService.getDecodeToken();
          if (token) {
            let user = new AuthenticateUser();
            let json = JSON.parse(token.User);
            user.email = json.email;
            user.name = json.name;
            user.ownerId = json.ownerId;
            user.ownerType = json.ownerType;
            user.userAccountId = json.userAccountId;
            this.loggedUser.next(user);
            this.authenticationState.next(true);
            resolve(true);
            this.getPlayerAndPerson(user);
          } else {
            this.authenticationState.next(false);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }, error => {
        resolve(false);
      })
    })

  }

  async login(user: User) {
    this.createLoading('Logging in');
    await this.securityService.post(user).then((response: any) => {
      if (response != undefined) {
        this.storgeConfigurations.set(TOKEN_KEY, response.accessToken).then(async () => {
          let token = this.tokenService.getDecodeToken(response.accessToken);
          if (token) {
            let user = new AuthenticateUser();
            let json = JSON.parse(token.User);
            user.email = json.email;
            user.name = json.name;
            user.ownerId = json.ownerId;
            user.ownerType = json.ownerType;
            user.userAccountId = json.userAccountId;
            this.loggedUser.next(user);
            this.authenticationState.next(true);
            await this.dismissLoading();
            this.getPlayerAndPerson(user);
            await EventService.get('navigatePagePatient').emit(true);
          } else {
            await this.authenticationState.next(false);
            await this.dismissLoading();
          }
        });
      } else {
        this.authenticationState.next(false);
      }
    }, async () => {
      const toast = await this.toastController.create({
        message: 'Login failed, invalid User or Password.',
        position: 'top',
        duration: 3000
      });
      await toast.present();
      await this.dismissLoading();
    })
  }

  logout() {
    this.storgeConfigurations.remove('currentInstitution');
    this.storgeConfigurations.remove('currentSector');
    this.storageBoard.remove('boards');
    this.storgeConfigurations.remove(TOKEN_KEY).then(() => {
      this.loggedUser.next(undefined);
      this.authenticationState.next(false);
      // window.location.reload();
      // this.router.ngOnDestroy();
    });
    EventService.get('logout').emit();
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  async createLoading(message?: string) {

    if (!message) {
      message = "Loading"
    }
    this.loading = await this.loadingController.create({
      message: message
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    } else {
      setTimeout(() => {
        this.loading.dismiss();
      }, 1000);
    }
  }

  private getPlayerAndPerson(user) {
    this.playerService.getById(user.ownerId).then(pl => {
      this.personService.getById(pl.personId).then((person: Person) => {
        pl.person = person
        user.player = pl;
        this.loggedUser.next(user);
      })
    })
  }

}