import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, Inject, ViewChild, ViewChildren } from '@angular/core';
import { ActionSheetController, ToastController, ModalController, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthenticateUser } from 'src/app/models/authenticate-user';
import { PatientService } from 'src/app/services/patient.service';
import { BoardService } from 'src/app/services/board.service';
import { Storage } from '@ionic/storage';
import { InstitutionAndSector } from 'src/app/modals/modal-institution/institutionAndSector';
import { EventService } from 'src/app/services/shared/EventsService';
import { PlayerService } from 'src/app/services/player.service';
import { PlayerPosition } from 'src/app/models/playerPosition';
import { Router } from '@angular/router';
import { PersonService } from 'src/app/services/person.service';
import { PlayerPositionOccupation } from 'src/app/models/playerPositionOccupation';
import { PlayerPositionOccupationService } from 'src/app/services/player-position-occupation.service';
import { SharedDataService } from 'src/app/services/shared/sharedDate.service';
import { CareTransferService } from 'src/app/services/careTransfer.service';
import { CareTransfer } from 'src/app/models/careTransfer';
import { CareTransferItem } from 'src/app/models/careTransferItem';
import { CareTransferItemsService } from 'src/app/services/care-transfer-item.service';
import { PlayerPositionService } from 'src/app/services/player-position.service';
import { BoardRecord } from 'src/app/models/BoardRecord';
import { Player } from 'src/app/models/player';
import { ActionHandoff } from 'src/app/models/publicEnums';
import { PlayerPositionToPlayerPositionService } from 'src/app/services/player-position-to-player-position.service';
import { PlayerPositionToPlayerPosition } from 'src/app/models/playerPositionToPlayerPosition';
import { Person } from 'src/app/models/person';
@Component({
  selector: 'patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
  providers: [PersonService]
})
export class PatientsPage extends InstitutionAndSector implements OnInit, OnDestroy {
  modeSelected: string = "my";
  userLogged: AuthenticateUser;
  tables: string[] = ['ROOM', 'PATIENT', 'CERVICALEXAM', 'ADMISSION', 'PREGNANCY', 'NURSING', 'PHYSICIAN', 'CONDITIONS', 'NOTES'];
  myPositions: PlayerPosition[] = [];
  showSearchBar: boolean = false;
  rowData: BoardRecord[] = [];
  rowDataFilter: BoardRecord[] = [];
  private actionHandoff: number = 0; // 0 startHandoff - 1 = cancel e confirm 
  private positionToHandoff: any;
  private careTransfer: any;
  @ViewChildren('searchPatients') searchPatients;
  showMessage: boolean = true;
  gettingRows: boolean = false;
  messageAssignToPatient: boolean = false;
  hubConnectionStatus: string = 'ONLINE';

  constructor(public actionSheetController: ActionSheetController,
    public authenticationService: AuthenticationService, public toastController: ToastController,
    private patientService: PatientService, public modalCtrl: ModalController, private boardService: BoardService,
    private playerService: PlayerService, private router: Router, private sharedService: SharedDataService,
    private personService: PersonService, private playerPositionOccupationService: PlayerPositionOccupationService,
    private sharedDataService: SharedDataService, private ref: ChangeDetectorRef,
    private careTransferService: CareTransferService, private careTransferItemsService: CareTransferItemsService,
    private playerPositionService: PlayerPositionService, public popoverController: PopoverController, private zone: NgZone,
    private playerPositionToPlayerPositionService: PlayerPositionToPlayerPositionService,

    @Inject('boards') private storageboard: Storage, @Inject('configurations') storgeConfigurations: Storage,

  ) {
    super(storgeConfigurations);

    this.eventsServices();

    let boardData = sharedService.boardData;
    boardData.subscribe((rows: any) => {
      console.log("Atualizou as Rows", rows);
      this.zone.run(() => {
        this.rowData = rows.rowData;
        this.rowDataFilter = this.rowData;
        if (this.rowData) this.checkViewMessageAssign();
      })
    })
    this.sharedDataService.hubConnectionStatusOnOf.subscribe((hubConnectionStatus: string) => {
      this.hubConnectionStatus = hubConnectionStatus;
    })
  }

  async ngOnInit() {
    this.getUserLogged();
    // console.log(this.userLogged);
    this.getLocalRowsData();
    this.getAllRows();
    this.getMyPositions();

    this.sharedDataService.connectToHub();
  }

  private checkViewMessageAssign() {
    let showMessage = true;
    for (let i = 0; i < this.rowData.length; i++) {
      if (this.rowData[i].admission && this.rowData[i].nursing) {
        if (this.rowData[i].nursing.length > 0) {
          if (this.rowData[i].nursing[0].id == this.userLogged.ownerId && this.rowData[i].nursing[0].positionOccupations.length > 0) {
            if (this.rowData[i].nursing[0].positionOccupations[0].position.shortName) {
              showMessage = false;
              break;
            }
          }
        }
      }
      let existis = this.existisPatientsToPhysician(this.rowData[i]);
      if (existis) {
        showMessage = false;
        break;
      }
    }
    this.messageAssignToPatient = showMessage;
  }

  private getLocalRowsData() {
    this.storageboard.get("boards").then(res => {
      if (res) {
        this.rowData = res.rowData;
        this.rowDataFilter = this.rowData;
        this.ref.detectChanges();
        // this.segmentChanged();
      }
    }, error => {
    })
  }


  async getAllRows() {
    this.gettingRows = true;
    await this.boardService.getByRowData(null, this.tables).then(async (res) => {
      this.rowData = [];
      this.rowDataFilter = this.rowData;
      // res = res.filter(x => x.room.statusUid.toUpperCase() != 'OUT_THE_DOOR');
      res.forEach(row => {
        if (row.nursing) {
          const nursy = row.nursing;
          row.nursing = nursy.filter(x => x.id == this.userLogged.ownerId);
          const nursings = nursy.filter(x => x.id != this.userLogged.ownerId);
          if (nursings) {
            nursings.forEach(nursy => {
              row.nursing.push(nursy);
            });
          }
        }
      });
      this.rowData = res;
      this.rowDataFilter = this.rowData;
      // this.allPatients = this.rowData;
      await this.removePhysicianToRowDataPresentNavBar(res);
      for (let i = 0; i < res.length; i++) {
        if (res[i].nursing) {
          res[i].nursing.forEach(nursing => {
            this.personService.getById(nursing.personId).then((person) => {
              nursing.person = person;
            });
          });
        }
        if (res[i].physician) {
          res[i].physician.forEach(physician => {
            this.personService.getById(physician.personId).then((person) => {
              physician.person = person;
              if (physician.positionOccupations[0].position.cssClassContent != undefined) {
                if (typeof (physician.positionOccupations[0].position.cssClassContent) == 'string') {
                  physician.positionOccupations[0].position.cssClassContent = JSON.parse(physician.positionOccupations[0].position.cssClassContent);
                }
                physician.positionOccupations[0].position['avatarColor'] = physician.positionOccupations[0].position.cssClassContent['background-color'];
              }
            });
          });
        }
        if (res.length - 1 == i) {
          let board = { rowData: res };
          this.rowDataFilter = this.rowData;
          await this.saveLocal(board);
          this.myPositions.forEach(position => {
            this.checkInHandoff(position.id);
          });
          this.gettingRows = false;
          // await this.storgeConfigurations.get('caretransfer').then(async (res) => {
          //   if (res) {
          //     this.modeSelected = 'my';
          //     this.actionHandoff = 1;
          //     this.rowDataFilter = this.rowDataFilter.filter(x => x.admission);
          //     res.items.forEach(item => {
          //       let index = this.rowDataFilter.findIndex(x => x.admission.id == item.admissionId);
          //       this.rowData[index]['handoff'] = item.endedOn == undefined ? false : true
          //       this.rowData[index].careTransferItem = item;
          //     });
          //     this.careTransfer = res;
          //     this.myPositions[0].careTransfer = res;
          //   }
          // });
        }
      }

    }).catch(err => {
      this.presentToast('Error in getting All patients');
      this.gettingRows = false;
    });

  }

  private checkInHandoff(positonId?) {
    if (!positonId) {
      positonId = this.myPositions[0].id
    }
    this.careTransferService.getByPlayerIdPositionId(this.userLogged.ownerId, positonId).then((careTransfer: CareTransfer) => {
      if (careTransfer) {
        let position = this.myPositions.find(x => x.id == careTransfer.outPlayerPositionId);
        if (careTransfer) {
          position['careTransfer'] = careTransfer;
          position['items'] = [];
          position['handoff'] = true;
          this.modeSelected = 'my';
          this.actionHandoff = 1;
          let careItems: any[] = [];
          let index = 0;
          this.careTransferService.getById(careTransfer.id, true).then(careTran => {
            this.rowDataFilter.forEach((row: BoardRecord) => {
              index++;
              if (row.admission) {
                let bExist = position['playerPositionToStations'].find(x => x.stationId == row.room.id && x.positionId == position.id);
                if (bExist) {
                  let careTransferItem = new CareTransferItem();
                  careTransferItem = careTran.items.find(x => x.admissionId == row.admission.id && x.stationOccupancyId == row.room['activeOccupancy'].id);
                  if (careTransferItem) {
                    careItems.push(careTransferItem);
                    row['handoff'] = careTransferItem.endedOn == undefined ? false : true
                    this.positionToHandoff = this.myPositions.find(x => x.id == careTransfer.outPlayerPositionId);
                  }
                }
              }
              if (index == this.rowDataFilter.length) {
                let itensSave = [];
                for (let i = 0; i < careItems.length; i++) {
                  let boardRecord = this.rowDataFilter.find(x => (x.admission == undefined ? 0 : x.admission.id) == careItems[i].admissionId);
                  if (boardRecord) {
                    boardRecord.careTransferItem = careItems[i];
                    itensSave.push(boardRecord)
                  }
                  if (careItems.length - 1 == i) {
                    this.boardService.updateRowsLocal(itensSave);
                  }
                }
                careTransfer.items = careItems;
                this.careTransfer = careTransfer;
              }
            })
          })
        }
      }
    })
  }
  private saveLocal(data) {
    this.boardService.saveRows(data).then(res => {
      // this.segmentChanged();
    })
  }

  async openAssessmentEditor(data, assessmentInstanceUid: string, rowUpdate: string, action?: string) {
    let obj = {
      assessmentInstanceUid: assessmentInstanceUid,
      rowUpdate: rowUpdate,
      assessmentInstances: [{}],
      currentRoom: data.room,
      assessmentParams: {
        admissionId: data.admission.id,
        objectId: data.patient.id,
        objectType: 2,
        activePatient: data.patient
      },
      admission: data.admission,
      action: action ? action : 'NEW',
      patient: data.patient
    }

    this.storgeConfigurations.set('assessment', obj).then(success => {
      this.router.navigate(['assessment']);
    })
  }

  // async openAssessmentEditor(data, action) {
  //   console.log(action);
  //   let obj = {
  //     assessmentInstanceUid : 'CERVICAL_EXAM',
  //     rowUpdate: ['cervicalExam'],
  //     assessmentInstances: [{}],
  //     currentRoom: data.room,
  //     assessmentParams: {
  //       admissionId: data.admission.id,
  //       objectId: data.patient.id,
  //       objectType: 2,
  //       activePatient: data.patient
  //     },
  //     admission: data.admission,
  //     action: action,
  //     patient: data.patient
  //   }

  //   this.storgeConfigurations.set('assessment', obj).then(success => {
  //     this.router.navigate(['assessment']);

  //   })
  // }

  private async getUserLogged() {
    await this.authenticationService.loggedUser.subscribe(async (user) => {
      this.userLogged = user;
    });
  }


  async doRefresh(event) {
    await this.getAllRows();
    await event.target.complete();
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


  async clickEntrePosition(data) {
    let buttons: any[] = [];
    this.myPositions.forEach(position => {
      if (position.requestAdmissionType == 2) {
        let buttonConfiguration = {
          text: position.name,
          icon: '',
          handler: () => {
            this.enterPosition(position, data);
          }
        }
        buttons.push(buttonConfiguration);
      }
    });

    buttons.push({ text: 'Close', icon: 'Close' });
    const actionSheet = await this.actionSheetController.create({
      header: data.patient.displayName + ' Enter Position ',
      buttons
    });
    await actionSheet.present();
  }

  async clickLeavePosition(data) {
    let buttons: any[] = [];
    // data.nursing.forEach(nursy => {
    data.nursing[0].positionOccupations.forEach(positionOccupation => {
      let buttonConfiguration = {
        text: positionOccupation.position.name,
        icon: '',
        handler: () => {
          this.leavePosition(positionOccupation, data, true);
        }
      }
      buttons.push(buttonConfiguration);
    });
    // });

    buttons.push({ text: 'Close', icon: 'Close' });
    const actionSheet = await this.actionSheetController.create({
      header: data.patient.displayName + ' Leave Position ',
      buttons
    });
    await actionSheet.present();
  }

  private displaceCurrentOccupants(enteringPosition: PlayerPosition, displacePosition: PlayerPosition, rowData: BoardRecord) {
    let qtdToNotification = 0, qtdNotification = 0;
    rowData.nursing.forEach(nursy => {
      if (nursy.positionOccupations && nursy.id != this.userLogged.ownerId) {
        nursy.positionOccupations.forEach(posOccupation => {
          if (enteringPosition.id == posOccupation.playerPositionId) {
            qtdToNotification += 1; // aqui serve sómente para contar quantas vezes deve ser atualizado o board
          }
        });
      }
    });

    rowData.nursing.forEach(nursy => {
      if (nursy.positionOccupations && nursy.id != this.userLogged.ownerId) {
        nursy.positionOccupations.forEach(posOccupation => {
          if (enteringPosition.id == posOccupation.playerPositionId) {
            qtdNotification += 1;
            this.leavePosition(posOccupation, rowData, qtdNotification == qtdToNotification)
            this.enteringPosition(displacePosition, rowData, nursy.id, qtdNotification == qtdToNotification);
            // this.sendToMessage('update', rowData.room.id);
          }
        });
      }
    });
  }

  private enterPosition(position, data) {
    let existis: boolean = false;
    data.nursing.forEach(nursy => {
      if (nursy.positionOccupations) {
        nursy.positionOccupations.forEach(posOccupation => {
          if (position.id == posOccupation.playerPositionId && !existis) {
            existis = true;
            this.playerPositionToPlayerPositionService.getRelated(position.id, 'PART_IS_DISPLACEBLE_TO_COUNTERPART').then(async (playerPositionToPlayerPositions: PlayerPositionToPlayerPosition[]) => {
              let buttons: any[] = [];
              playerPositionToPlayerPositions.forEach(async playerPositionToPlayerPosition => {
                let buttonConfiguration = {
                  text: playerPositionToPlayerPosition.counterPart.name,
                  icon: '',
                  handler: () => {
                    this.displaceCurrentOccupants(position, playerPositionToPlayerPosition.counterPart, data);
                  }
                }
                buttons.push(buttonConfiguration);
              });
              buttons.push({ text: 'Close', icon: 'Close' });
              const actionSheet = await this.actionSheetController.create({
                header: 'Displace current occupants',
                buttons
              });
              await actionSheet.present();
            }, error => {

            })
          }
        });
      }
    });
    this.enteringPosition(position, data, this.userLogged.ownerId, true);
  }

  private enteringPosition(position, data, playerId, notify) {
    let playerPositionOccupation = new PlayerPositionOccupation();
    playerPositionOccupation.id = 0;
    playerPositionOccupation.playerId = playerId;
    playerPositionOccupation.playerPositionId = position.id;
    playerPositionOccupation.checkinOn = new Date();
    if (position.requestAdmissionType == 2) {
      playerPositionOccupation.admissionId = data.admission.id;
      playerPositionOccupation.position = position;
      delete playerPositionOccupation.position.groups;
      delete playerPositionOccupation.position.occupations;
      this.playerPositionOccupationService.postWithStation(playerPositionOccupation, data.room.id).then(async (respond) => {
        if (respond) {
          if (respond['id'] != 0) {
            this.addPositionOccupation(data, respond, notify);
          } else {
            this.presentToast(`This player is already in this admission.
            Data not saved!`, 3000, 'danger')
          }
        }
      }, error => {
        let message = `${error.statusText}
        ${error.error.message}`
        this.presentToast(message, 5000, 'danger', true);
      });
    }
  }

  private leavePosition(occupation, data, notify) {
    if (occupation !== undefined) {
      occupation.checkoutOn = new Date();
      if (occupation.position.requestAdmissionType === 1) {
        data.room.name ? data.room.name : data.room.shortName;
        let msg = `IMPOSSIBLE TO LEAVE POSITION 

        This assignment is stable. The position '${occupation.position.name}' is assigned directly to '${data.room.name}'. Contact administrator.`;
        this.presentToast(msg, 6000, 'danger', true)
        // SAIR DE TODOS OS LEITOS
        // this.playerPositionOccupationService.put(occupation).then(res => {
        //   if (res) {
        //     this.removePositionOccupation(data, res);
        //   }
        // })
      } else {
        this.playerPositionOccupationService.putWithStation(occupation, data.room.id).then(res => {
          if (res) {
            this.removePositionOccupation(data, res, notify);
          }
        })
      }
    }
  }

  private addPositionOccupation(data, respond, notify) {
    let exists = false;
    if (data.nursing) {
      data.nursing.forEach(nursy => {
        if (this.userLogged.ownerId == nursy.id) {
          if (nursy.positionOccupations) {
            nursy.positionOccupations.push(respond);
            exists = true;
          }
          else {
            let nursy = { id: this.userLogged.ownerId, positionOccupations: [respond], position: respond.position };
            data.nursing.push(nursy);
            exists = true;
          }
        }
      });
      if (data.nursing.length == 0 || !exists) {
        this.playerService.getById(this.userLogged.ownerId).then((player: Player) => {
          this.personService.getById(player.personId).then((person: Person) => {
            player.person = person;
            if (!exists && data.nursing.length > 0) {
              player.positionOccupations = [respond];
              player.position = respond.position;
              data.nursing.unshift(player);
            } else {
              data.nursing[0] = player;
              data.nursing[0].positionOccupations = [respond];
              data.nursing[0].position = respond.position;
            }
            this.updateListRow(data);
          })
        })
      }
    }
    let findIndex = this.rowData.findIndex(x => x.room.id == data.room.id);
    this.rowData[findIndex] = data;

    if (notify) {
      this.sendToMessage('new', data.room.id);
    }
    this.saveLocal({ rowData: this.rowData });
  }

  private removePositionOccupation(data, occupation, notify) {
    for (let i = 0; i < data.nursing.length; i++) {
      let item = data.nursing[i].positionOccupations.filter(x => x.id == occupation.id);
      if (item) {
        for (let index = 0; index < this.rowData.length; index++) {
          if (this.rowData[index].room.id == data.room.id) {
            for (let w = 0; w < this.rowData[index].nursing.length; w++) {
              let indexOf = this.rowData[index].nursing[w].positionOccupations.indexOf(item[0]);
              if (indexOf >= 0) {
                if (notify) {
                  this.sendToMessage('update', data.room.id);
                }
                this.rowData[index].nursing[w].positionOccupations.splice(indexOf, 1);
                data.nursing = data.nursing.filter(x => x.id != item[0].playerId);
                this.updateListRow(data);
              }
            }
            break;
          }
        }
      }
    }
  }

  private sendToMessage(action, idsRoom) {
    const payload = { stationId: [idsRoom], columns: ['nursing'] }
    this.sharedDataService.sendToMessage(['board'], 'dataRow', payload, action).then();
  }

  private sendToMessageHandoff(action, careTransferItem?, stationId?) {
    const payload = { careTransferItem: careTransferItem, stationId: stationId, playerId: this.userLogged.ownerId, positionId: null };
    if (this.positionToHandoff) {
      payload.positionId = this.positionToHandoff.id;
    }
    this.sharedDataService.sendToMessage(['handoff'], 'handoff', payload, action).then();
  }

  openDetailRoom(idRoom) {
    this.router.navigate(['admission/', idRoom])
  }

  ngOnDestroy() {
    // this.ref.detach();
  }

  private getMyPositions() {
    this.playerService.getPlayerIdPositions(this.userLogged.ownerId).then(res => {
      res.sort((a: any, b: any) => {
        return a.name < b.name ? -1 : 1;
      });
      res.forEach(item => {
        this.playerPositionService.getById(item.id).then(playerPositions => {
          item.playerPositionToStations = playerPositions['playerPositionToStations'];
        })
      });
      this.myPositions = this.removeDuplicatesPositions(res);
    }, error => {
      this.presentToast('Error to load my Positions')
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

  private async removePhysicianToRowDataPresentNavBar(list: any[]) {
    await this.storgeConfigurations.get('navBarPlayers').then((res) => {
      if (res) {
        res.forEach(async (navBarPlayer) => {
          list.forEach(x => {
            if (x.physician) {
              x.physician = x.physician.filter(x => x.id != navBarPlayer.playerId);
            }
          })
        });
      }
    })
  }

  changeSearch(event) {
    const val = event.target.value.toLowerCase();
    const filteredAllPatients = this.rowData.filter(function (p) {
      if (p.patient) {
        return p.patient['displayName'].toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.rowDataFilter = filteredAllPatients;
    // this.segmentChanged();
  }

  cancelSearch(evt) {
    // this.myPatientsSearching = this.myPatients;
    this.showSearchBar = false;
  }

  clickIconSearchBar() {
    this.showSearchBar = !this.showSearchBar
    if (this.showSearchBar) {
      setTimeout(() => {
        this.searchPatients.setFocus();
      }, 0);
    }
  }


  // segmentChanged() {
  //   console.log('Segment changed', this.modeSelected);
  //   if (this.modeSelected == 'all') {
  //     this.rowDataFilter = this.rowData.filter(x => x.admission)
  //   } else if (this.modeSelected == 'my') {
  //     if (this.rowData) {
  //       this.rowDataFilter = [];
  //       this.rowData.forEach(data => {
  //         if (data.admission && data.nursing) {
  //           if (data.nursing.length > 0) {
  //             if (data.nursing[0].positionOccupations.length > 0) {
  //               if (data.nursing[0].positionOccupations[0].position.shortName) {
  //                 this.rowDataFilter.push(data);
  //               }
  //             }
  //           }
  //         }
  //       });
  //     }

  //   } else {
  //     this.rowDataFilter = this.rowData;
  // //   }

  // setTimeout(() => {
  //   this.changeDetectorRef.detectChanges();
  // }, 100);
  // }

  private updateListRow(data) {
    let indexRow = this.rowData.findIndex(x => x.room.id == data.room.id);
    this.rowData[indexRow] = data;
    let indexRowFilter = this.rowDataFilter.findIndex(x => x.room.id == data.room.id);
    this.rowDataFilter[indexRowFilter] = data;

    // this.sendToMessage('new', data.room.id);
    this.saveLocal({ rowData: this.rowData });
    // this.segmentChanged();
  }

  async openHandoff() {
    let buttons = [];
    if (this.actionHandoff == 0) buttons.push({ text: 'Start Handoff', icon: 'play', handler: () => { this.actionsHandoff(1, this.positionToHandoff); } });
    if (this.actionHandoff == 1) buttons.push({ text: 'Confirm Handoff', icon: 'thumbs-up', handler: () => { this.actionsHandoff(2, this.positionToHandoff); } });
    if (this.actionHandoff == 1) buttons.push({ text: 'Cancel Handoff', icon: 'thumbs-down', handler: () => { this.actionsHandoff(3, this.positionToHandoff); } });
    buttons.push({ text: 'Close', icon: 'close' });
    let msg = '';
    if (this.actionHandoff == 1 && this.positionToHandoff) {
      // if (this.positionToHandoff) {
      msg = ' : ' + this.positionToHandoff.shortName;
      // }
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Handoff ' + msg,
      buttons: buttons
    });

    await actionSheet.present();

  }

  private cleanCheckBoxHandoff() {
    this.rowDataFilter.forEach(row => {
      if (row['handoff']) delete row['handoff']
    });
  }

  confirmHandoffItem(boardItemRecord: BoardRecord, event, index) {
    const boardItemRecordError = Object.assign([], boardItemRecord);
    if (boardItemRecord.careTransferItem.endedOn == undefined) {
      boardItemRecord.careTransferItem.endedOn = new Date();
    } else {
      boardItemRecord.careTransferItem.endedOn = undefined;
    }
    let snapShot = {
      admission: boardItemRecord.admission,
      cervicalExam: boardItemRecord.cervicalExam,
      conditions: boardItemRecord.conditions,
      delivery: boardItemRecord.delivery,
      id: boardItemRecord.id,
      membranes: boardItemRecord.membranes,
      notes: boardItemRecord.notes,
      nursing: boardItemRecord.nursing,
      pain: boardItemRecord.pain,
      patient: boardItemRecord.patient,
      physician: boardItemRecord.physician,
      pregnancy: boardItemRecord.pregnancy,
      room: boardItemRecord.room,
      uid: boardItemRecord.uid
    }
    boardItemRecord.careTransferItem.stationOccupancyId = boardItemRecord.room['activeOccupancy'].id;
    boardItemRecord.careTransferItem.dataSnapshot = snapShot;
    boardItemRecord.careTransferItem.crudAction = 3;


    this.careTransferItemsService.put(boardItemRecord.careTransferItem).then(async (res) => {
      let msg = ` HANDOFF OK
      ${boardItemRecord.patient['displayName']}`;
      this.presentToast(msg, 600, 'success', false);
      this.sendToMessageHandoff(ActionHandoff.item, boardItemRecord.careTransferItem, boardItemRecord.room.id);
      this.storgeConfigurations.set('caretransfer', this.careTransfer).then(res => {
      })
    }, error => {
      this.presentToast(`Handoff Error of ${boardItemRecord.patient['displayName']}
      ${error}`, 600, 'danger');
      boardItemRecord = boardItemRecordError;
    })
  }


  private async actionsHandoff(action: number, position?) {
    if (this.myPositions.length == 1 && !position) position = this.myPositions[0];
    this.positionToHandoff = position;
    if (this.myPositions.length > 1 && !position) {
      let buttons = [];
      this.myPositions.forEach(position => {
        let exists = false;
        this.rowDataFilter.forEach(row => {
          if (row.nursing) {
            if (row.nursing[0]) {
              if (row.nursing[0].positionOccupations[0]) {
                if (row.nursing[0].positionOccupations[0].position.id == position.id) {
                  exists = true;
                }
              }
            }
          }
        });
        if (exists) {
          let buttonConfiguration = {
            text: position.name,
            icon: '',
            handler: () => {
              this.actionsHandoff(1, position);
            }
          }
          buttons.push(buttonConfiguration);
        }
      });

      buttons.push({ text: 'Close', icon: 'close' });
      const actionSheet = await this.actionSheetController.create({
        header: 'Position to Handoff',
        buttons: buttons
      });
      await actionSheet.present();
      return

      // } else if (!position.occupations) {
      //   await this.getMyPositions();
      //   this.presentToast('Not present in any position', 1000, 'warning');
    }
    else if (position) {
      if (action == 1) {
        this.positionToHandoff = position;
        this.modeSelected = 'my';
        await this.getMyPositions();
        if (position.playerPositionToStations.length > 0) {
          this.careTransferService.getNew({ sectorId: 1, outPlayerPositionId: position.id, outPlayerId: this.userLogged.ownerId }).then(async (response) => {
            let careTransfer = response as CareTransfer;
            // this.localStorage.set('onHandoff', true);
            if (careTransfer) {
              position.careTransfer = careTransfer;
              position.items = [];
              position.handoff = true;
              let careItems: any[] = [];
              let index = 0;
              this.rowDataFilter.forEach((row: BoardRecord) => {
                index++;
                if (row.admission) {
                  // && row.nursing[0].positionOccupations[0].playerPositionId == position.id
                  let bExist = position.playerPositionToStations.find(x => x.stationId == row.room.id && x.positionId == position.id
                    && row.nursing[0].positionOccupations[0].playerPositionId == position.id);
                  if (bExist) {
                    let careTransferItem = new CareTransferItem();
                    careTransferItem.admission = row.admission;
                    careTransferItem.admission.patient = row.patient;
                    careTransferItem.admissionId = row.admission.id;
                    careTransferItem.careTransferId = careTransfer.id;
                    careTransferItem.id = 0;
                    careTransferItem.startedOn = new Date();
                    careTransferItem.stationOccupancyId = row.room['activeOccupancy'].id;
                    careTransferItem.room = row.room;
                    careTransferItem.summary = "";
                    careItems.push(careTransferItem);
                    // row['inHandoff'] = true;
                  }
                }
                if (index == this.rowDataFilter.length) {
                  this.careTransferItemsService.postRange(careItems).then(async (items) => {
                    let handoffItems = items as CareTransferItem[];
                    let itensSave = [];
                    for (let i = 0; i < handoffItems.length; i++) {
                      let boardRecord = this.rowDataFilter.find(x => (x.admission == undefined ? 0 : x.admission.id) == handoffItems[i].admissionId);
                      if (boardRecord) {
                        boardRecord.careTransferItem = handoffItems[i];
                        itensSave.push(boardRecord)
                      }
                      if (handoffItems.length - 1 == i) {
                        this.boardService.updateRowsLocal(itensSave);
                      }
                    }
                    careTransfer.items = handoffItems;
                    this.careTransfer = careTransfer;
                    this.sendToMessageHandoff(ActionHandoff.Start);
                  })
                }
              })
            }

          });
          this.actionHandoff = 1;
        } else {
          this.presentToast('NO STATION FOR THIS PLAYER", "There is no station related to this player.', 1000, 'warning');
        }

        // })

      } else if (action == 2) {
        this.storgeConfigurations.set('positionToHandoff', this.positionToHandoff).then();
        this.storgeConfigurations.set('caretransfer', this.careTransfer).then(res => {
          this.router.navigate(['handoff']);
        })
      } else if (action == 3) {
        let careTransferId = position.careTransfer ? position.careTransfer.id : this.careTransfer.id;
        this.careTransferService.remove(careTransferId).then(async (res) => {
          await this.cleanCancelHandoff(position.id);
          this.sendToMessageHandoff(ActionHandoff.Cancel);
        }, error => {
          this.presentToast('Error to cancel HANDOFF');
        })
      }
    }
  }

  private async careTransferSubmited(careTransfer) {
    this.positionToHandoff.handoff = false;
    // if(Admission.id)
    let admission = false;
    let index = 0;
    if (admission) {
      // let newOccupations: PlayerPositionOccupation[] = [];
      // let oldOccupations: PlayerPositionOccupation[] = [];
      // let stationsUpdate: number[] = [];
      // const activeplayerId = this.positionToHandoff.careTransfer.outPlayerId;
      // let position = { ...  this.positionToHandoff };
      this.rowDataFilter.forEach(async (row: BoardRecord) => {
        index++;
        if (row.careTransferItem) {
          delete row.careTransferItem
        }
        // if (row.physician) {
        //   if (row.physician.length > 0) {
        //     await row.physician.forEach(async (physician) => {
        //       let occupations = await physician.positionOccupations.filter(x => (x.playerPositionId == careTransfer.outPlayerPositionId) && (x.playerId == careTransfer.outPlayerId));
        //       if (occupations != undefined) {
        //         await occupations.forEach(async (occupation) => {
        //           let exist = await newOccupations.find(x => x.playerId == occupation.playerId && x.playerPositionId == occupation.playerPositionId);
        //           if (!exist) {
        //             let newPlayerPositionOccupation = new PlayerPositionOccupation();
        //             newPlayerPositionOccupation.id = 0;
        //             newPlayerPositionOccupation.checkinOn = new Date();
        //             newPlayerPositionOccupation.playerId = careTransfer.inPlayerId;
        //             newPlayerPositionOccupation.playerPositionId = careTransfer.inPlayerPositionId;
        //             newPlayerPositionOccupation.admissionId = occupation.admissionId;
        //             newPlayerPositionOccupation.stationId = row.room.id;
        //             newPlayerPositionOccupation.position = this.positionToHandoff;
        //             newOccupations.push(newPlayerPositionOccupation);
        //             stationsUpdate.push(row.room.id)
        //             occupation.checkoutOn = new Date();
        //             oldOccupations.push(occupation);
        //           }
        //         })
        //       }
        //     })
        //   }
        // }
        // if (row.nursing) {
        //   if (row.nursing.length > 0) {
        //     row.nursing.forEach((nurse) => {
        //       let occupations = nurse.positionOccupations.filter(x => (x.playerPositionId == careTransfer.outPlayerPositionId) && (x.playerId == careTransfer.outPlayerId));
        //       if (occupations != undefined) {
        //         occupations.forEach((occupation) => {
        //           let exist = newOccupations.find(x => x.playerId == occupation.playerId && x.playerPositionId == occupation.playerPositionId);
        //           if (!exist) {
        //             let newPlayerPositionOccupation = new PlayerPositionOccupation();
        //             newPlayerPositionOccupation.id = 0;
        //             newPlayerPositionOccupation.checkinOn = new Date();
        //             newPlayerPositionOccupation.playerId = careTransfer.inPlayerId;
        //             newPlayerPositionOccupation.playerPositionId = careTransfer.inPlayerPositionId;
        //             newPlayerPositionOccupation.admissionId = occupation.admissionId;
        //             newPlayerPositionOccupation.stationId = row.room.id;
        //             newPlayerPositionOccupation.position = this.positionToHandoff;

        //             newOccupations.push(newPlayerPositionOccupation);
        //             stationsUpdate.push(row.room.id)
        //             occupation.checkoutOn = new Date();
        //             oldOccupations.push(occupation);
        //           }
        //         })
        //       }
        //     })
        //   }
        // }
        if (index == this.rowDataFilter.length) {
          this.cleanCheckBoxHandoff();
          this.actionHandoff = 0;
          // this.positionToHandoff.caretransfer = undefined;
          this.storgeConfigurations.remove('caretransfer').then(res => { });
          this.storgeConfigurations.remove('positionToHandoff').then();
          //   this.playerPositionOccupationService.putRange(oldOccupations).then(async (resp) => {
          //     let players: any[];
          //     await this.storgeConfigurations.get('navBarPlayers').then(res => {
          //       players = res;
          //     });
          //     if (players) {
          //       let pl = players.find(x => x.id == activeplayerId);
          //       if (pl) {
          //         players.splice(players.indexOf(pl), 1);
          //       }
          //     }


          //     if (newOccupations.length > 0) {

          //       this.playerPositionOccupationService.postRange(newOccupations).then(async (resp2: any) => {
          //         let res = resp2;
          //         // this.sendToMessage('update', stationsUpdate); // precisa concatenar como || e nao como array ',,,'
          //         // res.forEach((pos) => {
          //         //   pos.position = position;
          //         //   pos.positionShortName = postition.name;
          //         //   pos.positionUID = positionUID
          //         // })

          //         // await this._playerService.getById(res[0].playerId).then(async (pl) => {
          //         //   res[0].player = pl;
          //         //   players.push(res[0]);

          //         //   console.log('stationsUpdate', stationsUpdate)
          //         //   // await this._boardService.updatePhysicianByStations('LABOR_AND_DELIVERY_DEFAULT', stationsUpdate);
          //         //   await this._boardServiceX.updateRows(1, [], "physician")

          //         //   this.localStorage.set('navBarPlayers', players);
          //         //   this.sharedDataservice.setNavBarPlayers(players);
          //         //   //this.sharedDataservice.changeUpdateStatus(true);
          //         //   this.showBusy = false;
          //         // });

          //       })
          //     } else {
          //     }

          //   })


        }
      })
    } else {
      // this.rowDataFilter.forEach(async (row: BoardRecord) => {
      for (let i = 0; i < this.rowDataFilter.length; i++) {
        if (this.rowDataFilter[i].careTransferItem) {
          delete this.rowDataFilter[i].careTransferItem
        }

        if (i == this.rowDataFilter.length - 1) {
          this.positionToHandoff.handoff = false;
          this.cleanCheckBoxHandoff();
          this.actionHandoff = 0;

          // careTransfer = undefined;
          // this.playerService.getPlayerIdPositions(this.userLogged.ownerId).then(res => {
          //   res[0].occupations.forEach(occupation => {
          //     occupation.checkoutOn = new Date();
          //     if (occupation.player) delete occupation.player
          //     occupation.positionShortName = res[0].name;
          //     occupation.positionUID = res[0].uid;
          //   });

          //   this.playerPositionOccupationService.putRange(res[0].occupations).then(async (resp) => {
          //     // this.playerPositionOccupationService.put(occupation[0]).then((ret) => {

          //     let newPlayerPositionOccupation = new PlayerPositionOccupation();
          //     newPlayerPositionOccupation.id = 0;
          //     newPlayerPositionOccupation.checkinOn = new Date();
          //     newPlayerPositionOccupation.playerId = careTransfer.inPlayerId;
          //     newPlayerPositionOccupation.playerPositionId = careTransfer.inPlayerPositionId;
          //     newPlayerPositionOccupation.admissionId = undefined;

          //     this.playerPositionOccupationService.post(newPlayerPositionOccupation).then(async (ret2) => {

          //     })
          //   })
          // })

        } else {
          index++;
        }
      }
      // })

    }
    this.sendToMessageHandoff(ActionHandoff.Confirm);
  }

  private logout() {
    this.rowData = [];
    this.rowDataFilter = [];
    this.modeSelected = 'my';

  }

  private eventsServices() {
    EventService.get('updateTitleInstitutionAndSector').subscribe(res => {
      this.mountStringInstitutionSector();
    })
    EventService.get('handoffsubmited').subscribe(res => {
      this.careTransferSubmited(res);
    })
    EventService.get('logout').subscribe(() => {
      this.logout();
    })
    EventService.get('enterPosition').subscribe(position => {
      this.updateListRowToPosition(position);
    })
    EventService.get('navigatePagePatient').subscribe(res => {
      this.ngOnInit();
    })
    EventService.get('handoffMessage').subscribe(async (obj) => {
      if (obj.action == ActionHandoff.Start) {
        await this.checkInHandoff(obj.positionId);
        await this.presentToast('Handoff started', 2000, 'medium', true);
      } else if (obj.action == ActionHandoff.Confirm) {
        if (!obj.positionId) {
          obj.positionId = this.myPositions[0].id
        }
        await this.cleanCancelHandoff(obj.positionId);
        await this.presentToast('Handoff confirmed', 2000, 'medium', true);
        this.positionToHandoff = null;
      } else if (obj.action == ActionHandoff.Cancel) {
        if (!obj.positionId) {
          obj.positionId = this.myPositions[0].id
        }
        await this.cleanCancelHandoff(obj.positionId);
        await this.presentToast('Handoff canceled', 2000, 'medium', true);
        this.positionToHandoff = null;
      } else if (obj.action == ActionHandoff.item) {
        let indexDataFilter = this.rowDataFilter.findIndex(x => x.room.id == obj.stationId);
        let indexData = this.rowData.findIndex(x => x.room.id == obj.stationId);
        // this.rowData[indexData]['handoff'] = obj.careTransferItem;
        // this.rowDataFilter[indexDataFilter]['handoff'] = obj.careTransferItem;
        this.rowData[indexData]['handoff'] = obj.careTransferItem.endedOn == undefined ? false : true;
        this.rowDataFilter[indexDataFilter]['handoff'] = obj.careTransferItem.endedOn == undefined ? false : true
        this.rowData[indexData].careTransferItem = obj.careTransferItem;
        this.rowDataFilter[indexDataFilter].careTransferItem = obj.careTransferItem;
        this.saveLocal({ rowData: this.rowData });
      }
    })
  }

  private cleanCancelHandoff(positionId) {
    let i = this.myPositions.findIndex(x => x.id == positionId);
    this.myPositions[i].handoff = false;
    let index = 0;
    this.rowData.forEach((row: BoardRecord) => {
      index++;
      if (row.careTransferItem) {
        delete row.careTransferItem;
      }
      if (index == this.rowData.length) {
        this.myPositions[i].careTransfer = undefined;
        this.positionToHandoff = null;
        this.storgeConfigurations.remove('caretransfer').then(res => {
          this.rowDataFilter = Object.assign([], this.rowData);
          let board = { rowData: this.rowData };
          this.cleanCheckBoxHandoff();
          this.actionHandoff = 0;
          // this.sharedDataService.setBoardData(board);
          this.boardService.updateRowsLocal(this.rowData);
          // this.sendToMessageHandoff(ActionHandoff.Cancel);
        })
        this.storgeConfigurations.remove('positionToHandoff').then();
      }
    });
  }

  public updateListRowToPosition(position) {
    // if (position.requestAdmissionType == 1) {
    if (position.action == 'enter') {
      let playerPositionOccupation = new PlayerPositionOccupation();
      playerPositionOccupation.id = 0;
      playerPositionOccupation.playerId = this.userLogged.ownerId;
      playerPositionOccupation.playerPositionId = position.id;
      playerPositionOccupation.checkinOn = new Date();
      playerPositionOccupation.position = position;
      delete playerPositionOccupation.position.groups;
      delete playerPositionOccupation.position.occupations;
      this.playerService.getById(this.userLogged.ownerId).then((player: any) => {
        this.personService.getById(player.personId).then(person => {
          this.rowData.forEach((data, index) => {
            if (data.admission) {
              playerPositionOccupation.admissionId = data.admission.id;
            }
            if (data.nursing) {
              // data.nursing.forEach(nursy => {
              //   if (this.userLogged.ownerId == nursy.id) {
              //     if (nursy.positionOccupations) {
              //       nursy.positionOccupations.push(playerPositionOccupation)
              //     }
              //     else {
              //       data.nursing.push(player);
              //     }
              //   }
              // });
              if (data.nursing.length == 0) {
                player.person = person;
                data.nursing[0] = player;
                data.nursing[0].positionOccupations = [playerPositionOccupation];
                data.nursing[0].positionOccupations[0].position = position;
                data.nursing[0].position = playerPositionOccupation.position;
                // this.updateListRow(data);
              } else {
                let nursingToPlayerLogged: any = data.nursing.filter(x => x.id == this.userLogged.ownerId);
                const nursing = data.nursing.filter(x => x.id != this.userLogged.ownerId);
                data.nursing = [];

                if (nursingToPlayerLogged.length == 0) {
                  player.person = person;
                  data.nursing[0] = player;
                  data.nursing[0].positionOccupations = [playerPositionOccupation];
                  data.nursing[0].positionOccupations[0].position = position;
                  data.nursing[0].position = playerPositionOccupation.position;
                  nursingToPlayerLogged = data.nursing;
                }
                data.nursing = nursingToPlayerLogged;
                nursing.forEach(item => {
                  data.nursing.push(item);
                });
              }
            }
            if (index == this.rowData.length - 1) {
              // this.sharedDataService.setBoardData({ rowData: this.rowData });
              this.saveLocal({ rowData: this.rowData });
              this.showMessage = false;
              this.getMyPositions();
            }
          })
        })
      });
    } else if (position.action == 'leave') {
      this.rowData.forEach((data, index) => {
        if (data.nursing) {
          data.nursing = data.nursing.filter(x => x.id != this.userLogged.ownerId);
        }
        if (index == this.rowData.length - 1) {
          // this.sharedDataService.setBoardData({ rowData: this.rowData });
          this.saveLocal({ rowData: this.rowData });
        }
      })
    }
  }
  // }

  messageNotPermissionEditCervicalExam() {
    const msg = `Cannot edit. Go to list 'My Patients'`;
    this.presentToast(msg, 2500, 'warning', true);
  }


  changeModeSelected() {
    if (this.modeSelected == 'my') {
      this.modeSelected = 'all';
    } else {
      this.modeSelected = 'my';
    }
  }

  existisPatientsToPhysician(data): boolean {
    // debugger
    let existis: boolean = false;
    if (data.physician) {
      for (let i = 0; i < data.physician.length; i++) {
        if (data.physician[i].id == this.userLogged.ownerId) {
          existis = true;
        }
      }
    }
    return existis
  }

  openConditions() {
    this.router.navigate(['intervention/3']);
  }
  
}
