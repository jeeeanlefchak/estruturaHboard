import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { PlayerPositionOccupation } from 'src/app/models/playerPositionOccupation';
import { BoardService } from 'src/app/services/board.service';
import { Storage } from '@ionic/storage';
import { PlayerPositionService } from 'src/app/services/player-position.service';
import { CareTransfer } from 'src/app/models/careTransfer';
import { PlayerService } from 'src/app/services/player.service';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthenticateUser } from 'src/app/models/authenticate-user';
import { CareTransferService } from 'src/app/services/careTransfer.service';
import { CareTransferItem } from 'src/app/models/careTransferItem';
import { CareTransferItemsService } from 'src/app/services/care-transfer-item.service';
import { EventService } from 'src/app/services/shared/EventsService';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-handoff',
  templateUrl: './handoff.component.html',
  styleUrls: ['./handoff.component.scss']
})
export class HandoffComponent implements OnInit {
  public data: Array<{ text: string, value: number }>;
  public inPlayerSelected: { text: string, value: number };
  public inPlayerPositionsData: Array<{ text: string, value: number }> = [];
  public inPlayerPositionSelected: { text: string, value: number };
  uidBoard = 'LABOR_AND_DELIVERY_DEFAULT';
  userLogged: AuthenticateUser = new AuthenticateUser();
  careTransfer: CareTransfer = new CareTransfer();

  constructor(@Inject('configurations') public storgeConfigurations: Storage, private boardService: BoardService,
    private router: Router, private playerService: PlayerService, private toastController: ToastController,
    private authenticationService: AuthenticationService, private careTransferService: CareTransferService,
    private playerPositionService: PlayerPositionService, private zone: NgZone,
    private careTransferItemsService: CareTransferItemsService, @Inject('boards') private storageboard: Storage) { }

  ngOnInit() {
    this.storgeConfigurations.get('caretransfer').then(res => {
      this.careTransfer = res;
      console.log(res);
      this.getSettingBoard();
    })
    this.getUserLogged();
    this.getInPlayers();
    this.positionToHandoff();
  }

  private async getInPlayers() {

    this.playerService.getByPlayerPositionGroupUid('LABOR_AND_DELIVERY_UNIT_NURSES').then(physicians => {
      physicians.forEach((player: Player, index) => {
        let positions = player.positions.filter(x => x.id == this.careTransfer.outPlayerPositionId);

        if (positions.length > 0) {
          let obj = { text: player['person'].fullName, value: player.id };
          if (!this.data) this.data = []
          let exists = this.data.find(x => x.value == obj.value);
          if (!exists) {
            this.data.push(obj)
          }
        }

        if (physicians.length - 1 == index) {

          this.playerService.getRolesByPlayerPositionId(this.userLogged.ownerId).then(roles => {
            this.playerService.getByPlayerPositionGroupUid('LABOR_AND_DELIVERY_UNIT_NURSES').then(players => {
              players.sort((a: any, b: any) => {
                return a.person.fullName < b.person.fullName ? -1 : 1;
              });
              let i = 0;
              players.forEach((player) => {
                i++;
                player.positions.forEach(position => {
                  if (position.id == this.careTransfer.outPlayerPositionId) {
                    let existis = this.data.find(x => x.value == this.careTransfer.outPlayerPositionId);
                    if (!existis) {
                      roles.forEach(role => {
                        if (position.uid == role.uid) {
                          if (!this.data) this.data = []
                          let obj = { text: player['person'].fullName, value: player.id };
                          let bexists = this.data.find(x => x.value == obj.value);
                          if (!bexists) {
                            this.data.push(obj)
                          }
                        }
                      });
                    }
                  }
                });
                if (players.length - 1 == i) {
                  this.data = this.data.sort((a: any, b: any) => {
                    return a.value < b.value ? -1 : 1;
                  });
                  console.log("this.data", this.data);
                }
              });
            })
          })
        }
      })
    });
  }

  async onSubmit() {
    if (!this.userLogged) await this.getUserLogged()

    if (this.inPlayerSelected.value != undefined) {
      this.careTransfer.inPlayerId = this.inPlayerSelected.value;
      if (this.inPlayerPositionSelected != undefined) {
        this.careTransfer.inPlayerPositionId = this.inPlayerPositionSelected.value;
        this.careTransfer.endedOn = new Date();
        this.careTransferService.put(this.careTransfer).then(async () => {
          let i = 1;
          this.storageboard.get("boards").then(board => {
            this.careTransfer.items.forEach((item: CareTransferItem) => {
              if (item.endedOn == undefined) {
                let snapShot = Object.assign({}, board.rowData.find(x => (x.admission == undefined ? 0 : x.admission.id) == item.admissionId));
                delete snapShot.careTransferItem;
                item['dataSnapshot'] = snapShot;
                this.careTransferItemsService.put(item).then(() => {

                })
              }
              if (i == this.careTransfer.items.length) {
                EventService.get('handoffsubmited').emit(this.careTransfer);
                this.presentToast('Save Success ', 350, 'success');
                this.router.navigateByUrl('/tabs/patients');
              } else {
                i++;
              }
            })

          })
        })
      } else {
        this.presentToast("IN POSITION NOT SET Please choose a position.", 350, 'warning');

      }
    } else {
      this.presentToast("IIN PLAYER NOT SET Please choose a player.", 350, 'warning');

    }
  }

  private async getUserLogged() {
    this.authenticationService.loggedUser.subscribe(async (user: AuthenticateUser) => {
      this.userLogged = user;
    });
  }

  async presentToast(message, time?: number, color?: string) {
    console.log("open toast")
    const toast = await this.toastController.create({
      message: message,
      duration: time ? time : 2000,
      animated: true,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'Done',
      color: color ? color : 'danger',
      mode: 'ios',
      cssClass: 'toast'
    });
    toast.present();
  }

  close() {

  }


  public async getSettingBoard() {
    await this.boardService.getBoardByUid(this.uidBoard).then((res: any) => {
      let uids: any = res.settings.configurations[0].navbar[0].displayPlayerPositionList;
      const uidlastIndex = uids.length;
      for (let i = 0; i < uids.length; i++) {
        this.getPlayerPositionOccupations(uids[i].uid, i, uidlastIndex);
      }
    }, error => {
    })
  }

  private async getPlayerPositionOccupations(uid, index, uidlastIndex) {
    await this.playerPositionService.getOccupationByPosUID(uid).then(async (res: PlayerPositionOccupation[]) => {
      let players = [];
      await res.forEach((item) => {
        let exists = players.filter(x => x.playerId == item.playerId);
        if (exists.length == 0) {
          players.push(item);
          if (item.playerPositionId == this.careTransfer.outPlayerPositionId) {
            if (!this.data) this.data = [];
            this.data.push({ text: item.player.person.fullName, value: item.playerId })
          }
        }
      });
      if (uidlastIndex - 1 === index) {
        this.storgeConfigurations.set('navBarPlayers', players).then(() => {
          console.log('SALVOU NAVPLAYER');
          this.data = this.data.sort((a: any, b: any) => {
            return a.value < b.value ? -1 : 1;
          });
        });
      }
    }, error => {
    })
  }

  private positionToHandoff() {
    this.storgeConfigurations.get('positionToHandoff').then(res => {
      let obj = { value: res.id, text: res.shortName }
      this.inPlayerPositionsData.push(obj);
      this.inPlayerPositionSelected = obj;
    })
  }
}
