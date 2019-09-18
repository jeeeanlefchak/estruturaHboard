import { PlayerToGroup } from './../../models/playerToGroup';
import { PlayerToGroupService } from './../../services/player-to-group.service';
import { PlayerGroup } from './../../models/playerGroup';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { ActionSheetController, ToastController, LoadingController, MenuController } from '@ionic/angular';
import { PlayerPosition } from 'src/app/models/playerPosition';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthenticateUser } from 'src/app/models/authenticate-user';
import { InstitutionAndSector } from 'src/app/modals/modal-institution/institutionAndSector';
import { Storage } from '@ionic/storage';
import { SharedDataService } from 'src/app/services/shared/sharedDate.service';
import { PlayerPositionOccupation } from 'src/app/models/playerPositionOccupation';
import { PlayerPositionService } from 'src/app/services/player-position.service';
import { EventService } from 'src/app/services/shared/EventsService';
import { PlayerPositionOccupationService } from 'src/app/services/player-position-occupation.service';
import { PlayerPositionStationService } from 'src/app/services/player-position-station.service';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-occupations',
  templateUrl: './occupations.page.html',
  styleUrls: ['./occupations.page.scss'],
})
export class OccupationsPage extends InstitutionAndSector implements OnInit {

  context = "groups";
  myPositions: PlayerPosition[] = [];
  myGroups: PlayerGroup[] = [];
  userLogged: AuthenticateUser;
  loadingPositions: boolean = false;
  loadingGroups: boolean = false;
  loading: any;
  uidBoard = 'LABOR_AND_DELIVERY_DEFAULT';
  players: any[] = [];

  constructor(private playerService: PlayerService, private boardService: BoardService, private ref: ChangeDetectorRef,
    public actionSheetController: ActionSheetController, private playerPositionService: PlayerPositionService,
    public toastController: ToastController,
    private authenticationService: AuthenticationService,
    private playerToGroupService: PlayerToGroupService,
    public loadingController: LoadingController,
    @Inject('configurations') storgeConfigurations: Storage,
    private sharedData: SharedDataService, private menu: MenuController,
    private playerPositionOccupationService: PlayerPositionOccupationService,
    private playerPositionStationService: PlayerPositionStationService, ) {
    super(storgeConfigurations);

    EventService.get('messageNavBarPlayer').subscribe(res => {
      this.updatePositionOccupation(res);
    })

    EventService.get('professionalcare').subscribe(res => {
      this.getPositions();
    })

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
    await this.loading.dismiss();
  }

  async ngOnInit() {

    this.authenticationService.loggedUser.subscribe(async (user) => {
      this.userLogged = user;
      if (this.userLogged != undefined) {
        if (this.context == "positions") {
          this.getPositions();
        } else if (this.context == "groups") {
          this.getGroups();
        }
      }
    })
  }

  async getPositions() {
    return new Promise<any>(async (resolve, reject) => {
      this.loadingPositions = true;
      this.playerService.getPlayerPositions(this.userLogged.ownerId).then(async (playerPositions: PlayerPosition[]) => {
        playerPositions.sort((a: any, b: any) => {
          return a.name < b.name ? -1 : 1;
        });
        this.myPositions = this.removeDuplicatesPositions(playerPositions.filter(x => x.requestAdmissionType == 1));
        console.log(this.myPositions)
        this.loadingPositions = false;
        resolve();
      }, error => {
        this.loadingPositions = false
        reject();
      })
    })
  }

  removeDuplicatesPositions(playerPositions: PlayerPosition[]): PlayerPosition[] {
    // var input = this;
    let newList: PlayerPosition[] = []

    playerPositions.forEach(position => {
      let pos = newList.find(x => x.id === position.id)
      if (pos === undefined) {
        newList.push(position);
      }
    })

    return newList;
  }

  async getGroups() {
    return new Promise<any>(async (resolve, reject) => {
      this.loadingGroups = true;
      this.playerService.getPlayerGroups(this.userLogged.ownerId).then(async (playerGroups: PlayerGroup[]) => {
        playerGroups.sort((a: any, b: any) => {
          return a.name < b.name ? -1 : 1;
        });
        this.myGroups = playerGroups
        this.loadingGroups = false;
        resolve();
      }, error => {
        this.loadingGroups = false;
        reject();
      })
    })
  }

  async doRefresh(evt) {
    if (this.context == "positions") {
      if (this.userLogged != undefined) await this.getPositions();

    } else if (this.context == "groups") {
      if (this.userLogged != undefined) await this.getGroups();
    }
    setTimeout(() => {
      evt.target.complete();
    }, 20);
  }

  async clickSegment(segment) {
    if (segment == "positions") {
      if (this.myPositions.length == 0) this.getPositions()
    } else if (segment == "groups") {
      if (this.myGroups.length == 0) this.getGroups()
    }
  }

  async clickLeaveGroup(group: PlayerGroup) {
    const actionSheet = await this.actionSheetController.create({
      header: group.name,
      buttons: [{
        text: 'Leave Group',
        icon: 'log-in',
        handler: async () => {
          let playerToGroup = group.playerToGroups[0];
          playerToGroup.leftOn = new Date();
          await this.createLoading("Leaving the group");
          this.playerToGroupService.put(playerToGroup).then(() => {
            this.myGroups.forEach(async (grp) => {
              if (grp.playerToGroups != undefined) {
                let index = grp.playerToGroups.find(x => x.id == playerToGroup.id);
                if (index != undefined) {
                  delete grp.playerToGroups;
                  // grp.playerToGroups.splice(grp.playerToGroups.indexOf(index), 1);
                  this.sendToMessageCuston('Leave to group ' + grp.name, 'warning', 'new');
                  this.presentToast('Leave ' + grp.name + ' successfully.', 'success');
                }
              }
              await this.dismissLoading();
            })
          }, async (error) => {
            this.presentToast('Leave Error.', 'error');
            await this.dismissLoading();
          })
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async clickEnterGroup(group: PlayerGroup) {
    const actionSheet = await this.actionSheetController.create({
      header: group.name,
      buttons: [{
        text: 'Enter Group',
        icon: 'log-in',
        handler: async () => {
          let playerToGroup = new PlayerToGroup();
          playerToGroup.groupId = group.id;
          playerToGroup.playerId = this.userLogged.ownerId;
          playerToGroup.enteredOn = new Date();
          await this.createLoading("Entering the group");
          this.playerToGroupService.save(playerToGroup).then(async (response: PlayerToGroup) => {
            this.myGroups.forEach(async (group) => {
              if (group.id == response.groupId) {
                group.playerToGroups = [];
                group.playerToGroups.push(response);
                this.sendToMessageCuston('Enter to group ' + group.name, 'success', 'new');
                this.presentToast('Enter ' + group.name + ' successfully.', 'success');
              }
            })
            await this.dismissLoading();
          }, async (error) => {
            this.presentToast('Leave Group Error.', 'error');
            await this.dismissLoading()
          });
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async clickEnterPosition(position: PlayerPosition) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Position options',
      buttons: [{
        text: 'Enter',
        icon: 'log-in',
        handler: async () => {

          await this.createLoading("Entering the position");
          this.playerService.enterPosition(this.userLogged.ownerId, position.id).then(async (occ: any) => {
            this.myPositions.forEach(async (pos) => {
              if (pos.id == occ.playerPositionId) {
                pos.occupations.push(occ);
                this.presentToast('Enter ' + pos.name + ' successfully.', 'success');
                this.sendToMessageNavBarPlayers('enter', pos.id, occ.id);
                this.updateRowsPosition(Object.assign({}, pos), 'enter');
              }
            })
            await this.dismissLoading();
          }, async (error) => {
            this.presentToast('Error to Enter Position', 'error');
            await this.dismissLoading()
          });
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async clickLeavePosition(pos: PlayerPosition, occupancy: PlayerPositionOccupation) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Position options',
      buttons: [{
        text: 'Leave',
        icon: 'log-out',
        handler: async () => {
          await this.createLoading("Leaving the position");
          occupancy.checkoutOn = new Date();
          if (occupancy.roomId != undefined) {
            this.playerPositionOccupationService.put(occupancy).then(res => {
              if (res) {
                this.playerPositionStationService.putPositionDismissed(occupancy.playerPositionId, occupancy.roomId).then(async (res) => {
                  let index = pos.occupations.findIndex(x => x.id == occupancy.id);
                  pos.occupations.splice(index, 1);
                  this.sendToMessageNavBarPlayers('leave', pos.id, occupancy.id);
                  this.presentToast('Leave ' + pos.name + ' successfully.', 'success');
                  this.updateRowsPosition(Object.assign({}, pos), 'leave');
                  await this.dismissLoading();
                }, async (error) => {
                  this.presentToast('Error to leave position', 'error');
                  await this.dismissLoading();
                })
              }
            })
          } else {
            this.playerPositionOccupationService.put(occupancy).then(async (res) => {
              let index = pos.occupations.findIndex(x => x.id == occupancy.id);
              pos.occupations.splice(index, 1);
              this.sendToMessageNavBarPlayers('leave', pos.id, occupancy.id);
              this.presentToast('Leve ' + pos.name + ' successfully.', 'success');
              this.updateRowsPosition(Object.assign({}, pos), 'leave');
              await this.dismissLoading();
            }, async (error) => {
              this.presentToast('Error to leave position', 'error');
              await this.dismissLoading();
            })
          }
          // this.playerService.leavePosition(this.userLogged.ownerId, occupation.playerPositionId, occupation.id).then(async (occ: any) => {
          //   await this.myPositions.forEach(async (pos) => {
          //     let index = pos.occupations.find(x => x.id == occ.id);
          //     if (index != undefined) {
          //       pos.occupations.splice(pos.occupations.indexOf(index), 1);
          //       const toast = await this.toastController.create({
          //         message: 'Leave ' + pos.name + ' successfully.',
          //         position: 'top',
          //         duration: 2000
          //       });
          //       this.sendToMessageNavBarPlayers();
          //       await toast.present();
          //     }
          //   })
          //   await this.dismissLoading();
          // }, async (error) => {
          //   debugger
          //   await this.dismissLoading();
          // })
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  private updateRowsPosition(position, action) {
    let pos = Object.assign({}, position)
    EventService.get('updatePlayersNavBar').emit(true);
    pos['action'] = action;
    EventService.get('enterPosition').emit(pos);
  }

  sendToMessage(action) {
    const payload = { stationId: [], columns: ['nursing'] }
    this.sharedData.sendToMessage(['board', 'professionalcare'], 'nursing', payload, action).then();
  }

  sendToMessageCuston(text, color, action) {
    const payload = { stationId: [], columns: ['nursing'], text: text, color: color, playerId: this.userLogged.ownerId, }
    this.sharedData.sendToMessage(['professionalcare', 'board'], 'nursing', payload, action).then();
  }

  sendToMessageNavBarPlayers(action, positionId, occupancyId) {
    const payload = { positionId: positionId, stationId: [], columns: ['nursing'], playerId: this.userLogged.ownerId, occupancyId: occupancyId };
    this.sharedData.sendToMessage(['navbarplayers'], 'navbarplayers', payload, action).then();
  }

  public openMenu() {
    this.menu.enable(true, 'menuHome');
    this.menu.open('menuHome');
  }


  private async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2000,
      color: color
    });
    toast.present();
  }

  private updatePositionOccupation(obj) {
    if (obj.action == 'leave') {
      this.myPositions.forEach(position => {
        if (position.id == obj.positionId) {
          position.occupations = position.occupations.filter(x => x.id != obj.occupancyId);
          this.updateRowsPosition(Object.assign({}, position), 'leave');
        }
      });
    } else if (obj.action == 'enter') {
      // this.playerPositionOccupationService.getById(obj.occupancyId).then(res => {
      this.myPositions.forEach(position => {
        if (position.id == obj.positionId) {
          let exist = position.occupations.find(x => x.id == obj.occupancyId);
          if (!exist) {
            let occ: PlayerPositionOccupation = new PlayerPositionOccupation();
            occ.id = obj.occupancyId;
            occ.playerId = this.userLogged.ownerId;
            occ.playerPositionId = position.id;
            occ.checkinOn = new Date();
            position.occupations.push(occ);
            this.updateRowsPosition(Object.assign({}, position), 'enter');
          }
        }
      });
      // })
    }
    this.ref.detectChanges();
  }
}
