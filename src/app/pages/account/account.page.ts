import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthenticateUser } from 'src/app/models/authenticate-user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Player } from 'src/app/models/player';
import { UserAccountToUniversalUserAccountService } from 'src/app/services/user-account-to-universal-user-account.service';
import { UserAccountToUniversalUserAccount } from 'src/app/models/user-account-to-universal-user-account';
import { OwnerType } from 'src/app/models/user-account-owner-type';
import { UniversalUserAccount } from 'src/app/models/universalUserAccount';
import { UniversalUserAccountService } from 'src/app/services/universal-user-accounts.service';
import { UserAccountOwnerTypesService } from 'src/app/services/user-account-owner-type.service';
import { ModalController, ToastController, NavController, ActionSheetController } from '@ionic/angular';
import { CommChannel } from 'src/app/models/commChannel';
import { PersonCommChannelService } from 'src/app/services/person-comm-channel.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
// import { Base64 } from '@ionic-native/base64/ngx';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PersonService } from 'src/app/services/person.service';
import { Person } from 'src/app/models/person';
import { CommunicationChannelModal } from 'src/app/modals/communication-channel/channel.modal.';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements OnInit {
  private userLogged: AuthenticateUser;
  formPlayer: FormGroup;
  formUserAccountToUniversalUserAccount: FormGroup;
  ownerTypeList: OwnerType[] = [];
  universalUserAccountList: UniversalUserAccount[] = [];
  commChannels: CommChannel[] = [];
  commChannelsTypes = [
    { id: 0, text: 'None' },
    { id: 1, text: 'Home' },
    { id: 2, text: 'Work' },
    { id: 3, text: 'Cell' },
    { id: 4, text: 'Personal email' },
    { id: 5, text: 'Work email' },
    { id: 6, text: 'Home page' },
    { id: 7, text: 'Whatsapp' },
    { id: 8, text: 'Facebook' },
    { id: 9, text: 'LinkedIn' },
    { id: 10, text: 'Skype' },
    { id: 11, text: 'iMobile' }
  ]

  picture: SafeHtml;
  saving: boolean = false;
  gettingData: boolean = false;

  constructor(private playerService: PlayerService, private authenticationService: AuthenticationService,
    public formBuilder: FormBuilder, private userAccountToUniversalUserAccountService: UserAccountToUniversalUserAccountService,
    private ownerTypesService: UserAccountOwnerTypesService, private universalUserAccountService: UniversalUserAccountService,
    private modalControler: ModalController, private personCommChannelService: PersonCommChannelService, private zone: NgZone,
    private toastController: ToastController, private navCtrl: NavController, private actionSheetCtrl: ActionSheetController,
    private camera: Camera, private ref: ChangeDetectorRef,
    public domSanitizer: DomSanitizer, private personSerice: PersonService, ) {
    this.formPlayer = this.formBuilder.group({
      id: [null],
      personId: [null],
      person: this.formBuilder.group({
        prefix: [null],
        fullName: [null, Validators.compose([Validators.maxLength(150)])],
        firstName: [null, Validators.compose([Validators.maxLength(20), Validators.required])],
        lastName: [null, Validators.compose([Validators.maxLength(50)])],
        middleName: [null, Validators.maxLength(50)],
        picture: [null],
        displayName: [null, Validators.maxLength(20)],
        id: [null],
        commChannels: [null],
        deactivatedOn: [null],
      })
    });

    this.formUserAccountToUniversalUserAccount = this.formBuilder.group({
      id: [null],
      login: ['', Validators.compose([Validators.required, Validators.maxLength(75)])],
      password: ['', Validators.compose([Validators.maxLength(16)])],
      confirmPassword: [''],
      universalUserAccount: [null],
      userAccount: this.formBuilder.group({
        id: [null],
        email: ['', Validators.compose([Validators.maxLength(75)])],
        mobilePhone: ['', Validators.compose([Validators.maxLength(15)])],
        ownerType: [null],
      })
    })
  }

  async ngOnInit() {
    this.getUserLogged();
    this.getUniversalUserAccount();
    this.getOwnerType();
  }

  private getUserAccoutByOwnerId(ownerId: number) {
    this.userAccountToUniversalUserAccountService.getByOwnerId(ownerId).then((res: UserAccountToUniversalUserAccount) => {
      const values = res;
      if (values) {
        this.formUserAccountToUniversalUserAccount.get('userAccount.id').setValue(values.userAccount.id ? values.userAccount.id : null);
        this.formUserAccountToUniversalUserAccount.get('userAccount.email').setValue(values.userAccount.email ? values.userAccount.email : '');
        this.formUserAccountToUniversalUserAccount.get('userAccount.mobilePhone').setValue(values.userAccount.mobilePhone ? values.userAccount.mobilePhone : '');
        // this.formUserAccountToUniversalUserAccount.get('userAccount.ownerType').setValue(values.userAccount.ownerType ? values.userAccount.ownerType : null);
        this.formUserAccountToUniversalUserAccount.get('id').setValue(values.id ? values.id : 0);
        this.formUserAccountToUniversalUserAccount.get('login').setValue(values.login ? values.login : '');
        this.formUserAccountToUniversalUserAccount.get('password').setValue(values.password ? values.password : 0);
        this.formUserAccountToUniversalUserAccount.get('confirmPassword').setValue(values.password ? values.password : 0);
        // this.formUserAccountToUniversalUserAccount.get('universalUserAccount').setValue(values.universalUserAccount ? values.universalUserAccount : null);
      }
    }, error => {
      this.presentToast('Error to load user Account', 2000, 'danger', true);
    })
  }

  private async getUserLogged() {
    this.gettingData = true;
    await this.authenticationService.loggedUser.subscribe(async (user: AuthenticateUser) => {
      this.userLogged = user;
      this.getUserAccoutByOwnerId(user.ownerId);
      this.formUserAccountToUniversalUserAccount.get('userAccount.ownerType').setValue(user.ownerId);
      // if (user.player) {
      //   this.setValuesPlayer(user.player);

      // } else {
      this.playerService.getById(user.ownerId).then((player: Player) => {
        this.personSerice.getById(player.personId).then((person: Person) => {
          player.person = person;
          this.userLogged.player = player;
          this.setValuesPlayer(player);
          this.gettingData = false;
        }, error => {
          this.gettingData = false;
          this.presentToast('Error to load Person', 2000, 'danger', true);
        })
      }, error => {
        this.gettingData = false;
        this.presentToast('Error to load player', 2000, 'danger', true);
      })
      // }
    }, error => {
      this.gettingData = false;
      this.presentToast('Error to load user', 2000, 'danger', true);
    });
  }

  private setValuesPlayer(player: Player) {
    console.log("PLAYER", player);
    this.formPlayer.get('id').setValue(player.id ? player.id : null);
    this.formPlayer.get('personId').setValue(player.personId ? player.personId : null);
    this.formPlayer.get('person.prefix').setValue(player.person.prefix ? player.person.prefix : '');
    this.formPlayer.get('person.fullName').setValue(player.person.fullName ? player.person.fullName : '');
    this.formPlayer.get('person.firstName').setValue(player.person.firstName ? player.person.firstName : '');
    this.formPlayer.get('person.lastName').setValue(player.person.lastName ? player.person.lastName : '');
    this.formPlayer.get('person.middleName').setValue(player.person.middleName ? player.person.middleName : '');
    this.formPlayer.get('person.picture').setValue(player.person.picture ? player.person.picture : '');
    this.picture = player.person.picture;
    this.formPlayer.get('person.displayName').setValue(player.person.displayName ? player.person.displayName : '');
    this.formPlayer.get('person.id').setValue(player.person.id ? player.person.id : null);
    this.formPlayer.get('person.commChannels').setValue(player.person.commChannels ? player.person.commChannels : '');
    this.commChannels = player.person.commChannels;
    if (player.person.commChannels) {
      for (let i = 0; i < player.person.commChannels.length; i++) {
        this.commChannelsTypes.forEach(channel => {
          if (channel.id == player.person.commChannels[i].channelType) {
            player.person.commChannels[i].type = channel;
          }
        });
      }
    }
    // this.formPlayer.get('person.deactivatedOn').setValue(player.person.deactivatedOn ? player.person.deactivatedOn : '');
  }

  private getOwnerType() {
    this.ownerTypesService.getAll().then((res: OwnerType[]) => {
      this.ownerTypeList = res;
      let player = this.ownerTypeList.find(x => x.id == 4);
      this.zone.run(() => {
        this.formUserAccountToUniversalUserAccount.get('userAccount.ownerType').setValue(player);
      })
    }, error => {
      this.presentToast('Error to get User Account Owner Type', 2000, 'danger', true);
    })
  }


  private getUniversalUserAccount() {
    this.universalUserAccountService.getAll().then((universalUserAccounts: UniversalUserAccount[]) => {
      this.universalUserAccountList = universalUserAccounts;
      let helthDome = this.universalUserAccountList.find(x => x.id == 1);
      this.zone.run(() => {
        this.formUserAccountToUniversalUserAccount.get('universalUserAccount').setValue(helthDome);
      })
    }, error => {
      this.presentToast('Error to get Universal accounts', 2000, 'danger', true);
    })
  }

  async onSubmit() {

    if (!this.formPlayer.invalid &&
      this.formUserAccountToUniversalUserAccount.invalid) {

    } else {
      await this.onSubmitPlayer();
      await this.onSubmitUserAccount();
      await this.onSubmitChannel();
      this.presentToast('Save success', 2000, 'success', true);
      this.back();
    }
  }

  private onSubmitChannel() {

    if (this.commChannels.length > 0) {
      let commChannelsToSave: CommChannel[] = [];
      let commChannelsToUpdate: CommChannel[] = [];
      this.commChannels.forEach((comm: CommChannel) => {
        if (comm.id < 0 || !comm.id) {
          comm.id = 0;
          commChannelsToSave.push(comm);
        } else {
          if (comm.edited) {
            commChannelsToUpdate.push(comm);
          }
        }
      });
      if (commChannelsToSave.length > 0) {
        this.saving = true;
        this.personCommChannelService.postRange(commChannelsToSave).then((res) => {
          res.forEach(channelS => {
            this.commChannels.forEach(channelV => {
              if (channelS.identificator == channelV.identificator) {
                channelV = channelS;
              }
            });
          });
          this.saving = false;
        }, error => {
          this.presentToast('Error to save Channel', 2000, 'danger', true);
          this.saving = false;
        });
      }
      if (commChannelsToUpdate.length > 0) {
        this.saving = true;
        this.personCommChannelService.putRange(commChannelsToUpdate).then((res) => {
          debugger
          res.forEach(channelS => {
            this.commChannels.forEach(channelV => {
              if (channelS.identificator == channelV.identificator) {
                channelV = channelS;
              }
            });
          });
        }, error => {
          this.presentToast('Error to update Channel', 2000, 'danger', true);
          this.saving = false;
        });
      }
    }
  }

  private async onSubmitPlayer() {
    this.saving = true;
    if (this.formPlayer.get('person.middleName').value) {
      this.formPlayer.get('person.fullName').setValue(this.formPlayer.get('person.firstName').value + ' ' +
        this.formPlayer.get('person.middleName').value + ' ' + this.formPlayer.get('person.lastName').value);
    } else {
      this.formPlayer.get('person.fullName').setValue(this.formPlayer.get('person.firstName').value + ' ' + this.formPlayer.get('person.lastName').value);
    }
    let player = this.formPlayer.value as Player;
    const person = this.userLogged.player.person;
    player.person.createdBy = person.createdBy;
    player.person.createdOn = person.createdOn;
    // player.person.crudAction = person.crudAction;
    // player.person['identifiers'] = person['identifiers'];
    player.person.modifiedBy = person.modifiedBy;
    player.person.modifiedOn = person.modifiedOn;
    player.person.occupations = person.occupations;
    // player.person.personRelationships = person.personRelationships;
    this.userLogged.player.person = player.person;
    await this.playerService.put(this.userLogged.player).then(res => {
      console.log("salvou player");
      this.saving = false;
    }, error => {
      this.saving = false;
      this.presentToast('Error to updaded player ');
    })
  }

  private onSubmitUserAccount() {
    this.saving = true;
    let user = this.formUserAccountToUniversalUserAccount.value as UserAccountToUniversalUserAccount;
    if (user.universalUserAccount) {
      user.universalUserAccountid = user.universalUserAccount.id;
    }
    if (user.userAccount.ownerType) {
      user.userAccount.ownerTypeId = user.userAccount.ownerType.id;
    }
    user.userAccount.ownerId = this.userLogged.ownerId;
    console.log(user);
    if (user.id) {
      this.userAccountToUniversalUserAccountService.put(user).then(res => {
        const universal = res;
        this.formUserAccountToUniversalUserAccount.get('userAccount.id').setValue(universal.userAccount.id);
        this.formUserAccountToUniversalUserAccount.get('id').setValue(universal.id);
        console.log("salvou puT userAccountToUniversalUserAccountService")
      }, error => {
        this.presentToast('User not save success', 2000, 'danger', true);
      })
    } else {
      this.userAccountToUniversalUserAccountService.post(user).then(res => {
        const universal = res;
        console.log("salvou puT post")
        this.formUserAccountToUniversalUserAccount.get('userAccount.id').setValue(universal.userAccount.id);
        this.formUserAccountToUniversalUserAccount.get('id').setValue(universal.id);
        this.saving = false;
      }, error => {
        this.presentToast('User not save success', 2000, 'danger', true);
        this.saving = false;
      })
    }
  }

  async openModalChannel() {
    const modal = await this.modalControler.create({
      component: CommunicationChannelModal
    });

    modal.onDidDismiss().then(res => {
      if (res.data) {
        let obj = new CommChannel();
        obj.type = res.data.channel;
        obj.identificator = res.data.text;
        obj.personId = this.userLogged.player.personId;
        obj.channelType = res.data.channel.id;
        this.commChannels.unshift(obj);
      }
    })
    await modal.present();
  }

  onClickRemoveChannel(args, commChannel: CommChannel) {
    let comm = this.commChannels.find(x => x.id == commChannel.id && x.identificator == commChannel.identificator)
    if (comm) {
      let index = this.commChannels.indexOf(comm);
      this.commChannels[index].inactivatedOn = new Date();
      this.commChannels[index].edited = true;
    }
  }

  async presentToast(message, time?: number, color?: string, showButton?: boolean) {
    console.log("open toast")
    const toast = await this.toastController.create({
      message: message,
      duration: time ? time : 2000,
      animated: true,
      position: 'top',
      showCloseButton: showButton ? showButton : false,
      closeButtonText: 'X',
      color: color ? color : 'danger',
      mode: 'ios',
      cssClass: 'toast'
    });
    toast.present();
  }

  back() {
    this.navCtrl.pop();
  }

  // async openOptionPicture() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Albums',
  //     buttons: [{
  //       text: 'Câmera',
  //       role: 'destructive',
  //       icon: 'camera',
  //       handler: () => {
  //         this.captura('camera');
  //       }
  //     }, {
  //       text: 'Galery',
  //       icon: 'photos',
  //       handler: () => {
  //         this.captura('galery');
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }

  // private captura(open) {
  //   if (open == 'galery') {

  //     let options: ImagePickerOptions = {
  //       // title: "Select picture",
  //       // message: 'Select min 1',
  //       // outType: 0,
  //       maximumImagesCount: 1,
  //       width: 128,
  //       height: 128,
  //       quality: 100,
  //     };
  //     let me = this;
  //     me.imagePicker.getPictures(options).then((results) => {
  //       if (results) {
  //         this.encodingBase64(results[0]);
  //       }
  //     }, (err) => {
  //       alert(err);
  //     });
  //   } else if (open == 'camera') {
  //     const options: CameraOptions = {
  //       quality: 100,
  //       destinationType: this.camera.DestinationType.FILE_URI,
  //       encodingType: this.camera.EncodingType.JPEG,
  //       mediaType: this.camera.MediaType.PICTURE,
  //       targetHeight: 128,
  //       targetWidth: 128
  //     }
  //     this.camera.getPicture(options).then((imageData) => {
  //       if (imageData) {
  //         this.encodingBase64(imageData);
  //       }
  //     }, (err) => {
  //     });
  //   }
  // }

  // private encodingBase64(urlImg) {
  //   let filePath: string = urlImg;
  //   this.base64.encodeFile(filePath).then((base64File: string) => {
  //     console.log(base64File);
  //     this.picture = base64File;// this.domSanitizer.bypassSecurityTrustResourceUrl(base64File);
  //     this.formPlayer.get('person.picture').setValue(base64File);
  //     this.ref.detectChanges();
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }
}
