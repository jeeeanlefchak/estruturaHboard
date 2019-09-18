import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';
import { Board } from '../models/board';
import { BoardRecord } from '../models/BoardRecord';
import { SharedDataService } from './shared/sharedDate.service';
import { Storage } from '@ionic/storage';
import { PersonService } from './person.service';
import { AuthenticationService } from './authentication.service';
import { AuthenticateUser } from '../models/authenticate-user';
import { EventService } from './shared/EventsService';
import { PlayerPosition } from '../models/playerPosition';
import { PlayerService } from './player.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BoardService extends AbstractService<Board> {
  private userLogged: AuthenticateUser;

  constructor(http: HttpClient, protected dataConnService: DataConnService, private sharedDataservice: SharedDataService,
    @Inject('boards') private storageboard: Storage, private personService: PersonService, private authenticationService: AuthenticationService,
    @Inject('configurations') private storageConfigurations: Storage, private playerService: PlayerService) {
    super(http, dataConnService);

    this.sharedDataservice.hubNotification.subscribe((message: any) => {
      if (message.target.find(x => x.toLocaleLowerCase() == 'board')) {
        let columns: string[] = [];
        if (message.payload.columns != "") {
          message.payload.columns.forEach(colum => {
            columns.push(colum);
          });
          if (!columns.includes("room")) {
            columns.push('room');
          }
        }

        this.getByRowData([message.payload.stationId], columns).then(res => {
          let index = 0;
          let myBord = this.sharedDataservice.getBoardData().subscribe((board: any) => {
            console.log("Chamou o getBoardData, stationID", message.payload.stationId);
            let exists: boolean = false;
            res.forEach(columUpdated => {
              for (index = 0; index < board.rowData.length; index++) {
                if (board.rowData[index].room) {
                  if (board.rowData[index].room.id == columUpdated.room.id) {
                    exists = true;
                    columns.forEach(async column => {
                      if (column != "") {
                        board.rowData[index][column] = columUpdated[column];
                        if (column == 'nursing') {
                          res.forEach(row => {
                            board.rowData[index].nursing = row.nursing;//.filter(x => x.id == this.userLogged.ownerId);
                          });
                          if (board.rowData[index].nursing) {
                            const nursyBoard = board.rowData[index].nursing;
                            const nursingPlayerLogged = nursyBoard.filter(x => x.id == this.userLogged.ownerId);
                            const nursings = nursyBoard.filter(x => x.id != this.userLogged.ownerId);
                            board.rowData[index].nursing = nursingPlayerLogged;
                            if (nursings) {
                              nursings.forEach(item => {
                                board.rowData[index].nursing.push(item);
                              });
                            }
                            board.rowData[index].nursing.forEach(nursy => {
                              this.personService.getById(nursy.personId).then((person) => {
                                nursy.person = person;
                              });
                            });
                          }
                        } else if (column == 'physician') {
                          await this.updatePhysician(board.rowData[index].physician)
                        }
                      } else {
                        if (columUpdated.nursing) {
                          // devo colocar a nursing que estou logado por primeiro
                          const nursy = columUpdated.nursing;
                          columUpdated.nursing = nursy.filter(x => x.id == this.userLogged.ownerId);
                          const nursings = nursy.filter(x => x.id != this.userLogged.ownerId);
                          if (nursings) {
                            nursings.forEach(nursy => {
                              columUpdated.nursing.push(nursy);
                            });
                          }
                          columUpdated.nursing.forEach(nursy => {
                            this.personService.getById(nursy.personId).then((person) => {
                              nursy.person = person;
                            });
                          });
                        }
                        if (columUpdated.physician) await this.updatePhysician(columUpdated.physician);

                        board.rowData[index] = columUpdated;
                      }

                    });
                    if (message.payload.columns.length == 0) {
                      board.rowData[index] = columUpdated;
                    }

                    break;
                  }
                }
                if (message.payload.stationId.length == 0) {
                  break;
                }
              }
            });

            if (!exists) {
              board.rowData.push(res[0]);
            }
            // this.sharedDataservice.getBoardData().complete; 
            // console.log("ll", board)
            this.saveRows(board);
            // this.sharedDataservice.setBoardData(board);
          }, error => {
            console.log("ERRO NA ROW NO INDEX", index);
          })
          if (myBord) {
            myBord.unsubscribe();
          }
        });
      } else if (message.target.find(x => x.toLocaleLowerCase() == 'navbarplayers')) {
        const obj = {
          action: message.action,
          occupancyId: message.payload.occupancyId,
          positionId: message.payload.positionId,
          playerId: message.payload.playerId
        }
        if (this.userLogged.ownerId == obj.playerId) {
          EventService.get('messageNavBarPlayer').emit(obj);
          this.playerService.getPlayerPositions(this.userLogged.ownerId).then(async (playerPositions: PlayerPosition[]) => {
            const positions = playerPositions.filter(x => x.requestAdmissionType == 1);
            positions[0]['action'] = obj.action;
            EventService.get('enterPosition').emit(positions[0]);
            EventService.get('updatePlayersNavBar').emit(true);
          })
        }
      } else if (message.target.find(x => x.toLocaleLowerCase() == 'handoff')) {
        const obj = {
          action: message.action,
          careTransferItem: message.payload.careTransferItem ? message.payload.careTransferItem : null,
          stationId: message.payload.stationId ? message.payload.stationId : null,
          playerId: message.payload.playerId,
          positionId: message.payload.positionId
        }
        if (obj.playerId == this.userLogged.ownerId) {
          EventService.get('handoffMessage').emit(obj);
        }
        // if (message.action == ActionHandoff.Start) {
        //     EventService.get('handoffMessage').emit(ActionHandoff.Start);
        // } else if (message.action == ActionHandoff.Confirm) {
        //     EventService.get('handoffMessage').emit(ActionHandoff.Confirm);
        // } else if (message.action == ActionHandoff.Cancel) {
        //     EventService.get('handoffMessage').emit(ActionHandoff.Cancel);
        // } else if (message.action == ActionHandoff.item) {
        //     EventService.get('handoffMessage').emit(ActionHandoff.item);
        // }
      } else if (message.target.find(x => x.toLocaleLowerCase() == 'professionalcare')) {
        debugger
        EventService.get('professionalcare').emit();
      }

    })

    this.getUserLogged();
  }

  private async  updatePhysician(physician) {
    if (physician.physicians) {
      await this.storageConfigurations.get('navBarPlayers').then((res) => {
        physician.physicians.forEach(async (physician) => {
          if (res) {
            res = res.filter(x => x.playerId == physician.id)
          } else {
            res = [];
          }
          if (res.length <= 0) {
            this.personService.getById(physician.personId).then((person) => {
              physician.person = person;
              if (physician.positionOccupations[0].position.cssClassContent != undefined) {
                if (typeof (physician.positionOccupations[0].position.cssClassContent) == 'string') {
                  physician.positionOccupations[0].position.cssClassContent = JSON.parse(physician.positionOccupations[0].position.cssClassContent);
                }
                physician.positionOccupations[0].position['avatarColor'] = physician.positionOccupations[0].position.cssClassContent['background-color'];
              }
            });
          }
        });
      });
    }
  }

  public getService(): string {
    return 'boards';
  }
  private async getUserLogged() {
    await this.authenticationService.loggedUser.subscribe(async (user) => {
      this.userLogged = user;
    });
  }

  public getLocalRowByStationId(stationId: number) {
    return new Promise<BoardRecord>(async (resolve, reject) => {
      this.sharedDataservice.getBoardData().subscribe((board: any) => {
        if (board.rowData != undefined) {
          board.rowData.forEach(rowData => {
            if (rowData.room.id == stationId) {
              resolve(rowData)
            }
          });
        }
      }, error => {
        reject(error)
      })
    })
  }

  public async getDataByUid(): Promise<BoardRecord[]> {
    return new Promise<BoardRecord[]>((resolve, reject) => {
      this.http.get(this.urlBase + "/x/LABOR_AND_DELIVERY_DEFAULT").toPromise()
        .then((data: any) => {
          debugger
          this.http.get(this.urlBase + '/1/RowData').toPromise()
            .then(async (res) => {
              let rowData = res as BoardRecord[];
              console.log('data', data)
              console.log('data.json()', data.json())
              let board = data;
              board.id = 2;
              board.rowData = rowData;
              this.storageboard.set('board', board).then(async (data) => {
                debugger
              });
              this.sharedDataservice.setBoardData(rowData);
              resolve(rowData);
            })
            .catch(e => {
              // this.toastNotification.error('Error', 'Connection failed.');
              reject();
            });
        })
    })
  }

  public updateRowsLocal(obj: BoardRecord[]) {
    return new Promise<BoardRecord[]>(async (resolve, reject) => {
      this.storageboard.get('boards').then(async (data) => {
        for (let i = 0; i < data.rowData.length; i++) {
          obj.forEach(row => {
            if (data.rowData[i].room) {
              if (data.rowData[i].room.id == row.room.id) {
                data.rowData[i] = Object.assign({}, row);
              }
            }
          });
        }
        this.saveRows(data);
      })
    })
  }

  public updateRowLocalByStationId(obj: BoardRecord) {
    return new Promise<BoardRecord[]>(async (resolve, reject) => {
      this.storageboard.get('boards').then(async (data) => {
        for (let i = 0; i < data.rowData.length; i++) {
          if (data.rowData[i].room) {
            if (data.rowData[i].room.id == obj.room.id) {
              data.rowData[i] = Object.assign({}, obj);
              break;
            }
          }
        }
        this.saveRows(data);
      })
    })
  }

  updateColumnByStationId(stationId: number, column: string) {
    return new Promise<any>(async (resolve, reject) => {
      await this.getByRowData([stationId], [column]).then(rowUpdated => {
        this.storageboard.get('boards').then(board => {
          board.rowData.forEach(item => {
            if (item.room.id == stationId) {
              item[column] = rowUpdated[0][column];
            }
          });
          this.saveRows(board);
          resolve(board);
        })
      }, error => {
        reject(error);
      });
    })
  }

  updateColumByStationIdLocal(stationId: number, column: string, obj: any) {
    return new Promise<any>(async (resolve, reject) => {
      await this.getByRowData([stationId], [column]).then(rowUpdated => {
        this.storageboard.get('boards').then(board => {
          board.rowData.forEach(item => {
            if (item.room.id == stationId) {
              item[column] = rowUpdated[0][column];
            }
          });
          this.saveRows(board);
          resolve(board);
        })
      }, error => {
        reject(error);
      });
    })
  }

  saveRows(board) {
    console.log("SALVANDO LOCAL", board)
    return new Promise<boolean>(async (resolve, reject) => {
      this.storageboard.set('boards', board).then(async (data) => {
        this.sharedDataservice.setBoardData(data);
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public getRowDataByIds(boardId: number, roomIds?: string, columns?: string) {
    return new Promise<any>(async (resolve, reject) => {
      let cols = columns ? "&columns=" + columns : "";
      const url = `${this.urlBase}/${boardId}/rowData?stationIds=${roomIds}${cols}`
      this.http.get(url).toPromise().then((resp) => {
        resolve(resp as any);
      }).catch(() => reject(undefined))
    })
  }

  public async getBoardByUid(boardUid: string) {
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.get(this.urlBase + "/x/" + boardUid, httpOptions).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  public getByRowData(idsBedrooms: number[], tables?: string[]) {
    let url = `${this.urlBase}/1/rowdata`;
    if (idsBedrooms) {
      // if (idsBedrooms.length > 1) {
      url += '?stationIds=';
      // } else if (idsBedrooms.length == 1) {
      // url += '?stationId=';
      // }
      for (let i = 0; i < idsBedrooms.length; i++) {
        url += idsBedrooms[i];
        if (idsBedrooms.length - 1 > i) {
          url += '|';
        }
      }
    }
    if (idsBedrooms) {
      if (idsBedrooms.length > 0 && tables) {
        url += '&'
      } else if (idsBedrooms.length == 0 && tables) {
        url += '?'
      }
    } else {
      url += '?'
    }
    // if (table) url += 'columns=' + table;

    if (tables) {
      url += 'columns=';
      for (let i = 0; i < tables.length; i++) {
        url += tables[i];
        if (tables.length - 1 > i) {
          url += '|';
        }
      }
    }
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.get(url, httpOptions).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  public async getNavBarPlayers(boardUid: string) {
    return new Promise<any[]>((resolve, reject) => {
      this.http.get(this.urlBase + "/" + boardUid + "/navbarplayers").toPromise()
        .then((data) => {
          resolve(data as any[])
        })
    })
  }
  
}

