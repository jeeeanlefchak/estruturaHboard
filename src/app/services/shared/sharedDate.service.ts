import { AbstractService } from "../abstract.service";
import { DataConnService } from "./data-conn.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnDestroy, Inject } from "@angular/core";
import { HubConnection } from "@aspnet/signalr";
import * as signalR from "@aspnet/signalr";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { BoardRecord } from "src/app/models/BoardRecord";
import { Storage } from "@ionic/storage";
import { UtilService } from "../util.service";
import { WebSocketMessageService } from "../web-socket-message.service";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService extends AbstractService<any> implements OnDestroy {

  public getService(): string {
    return '';
  }

  private hubConnection: HubConnection;
  private hubId: string;
  public hubNotification = new Subject();
  public boardData = new BehaviorSubject<BoardRecord[]>([]);

  private connectionMonitor: Observable<boolean>;
  public internetConnectionStatus: string = 'ONLINE';
  public hubConnectionStatus: string = 'OFFLINE';
  public hubConnectionStatusOnOf = new Subject();
  // public winSockUpdateRows = new Subject();

  constructor(http: HttpClient, public dataConnService: DataConnService, @Inject('configurations') private storageConfigurations: Storage,
    private _utilService: UtilService, private _webSocketMessageService: WebSocketMessageService) {
    super(http, dataConnService);
    this.boardData.next([]);

    this.connectionMonitor = new Observable((observer) => {
      window.addEventListener('offline', (e) => {
        observer.next(false);
      });
      window.addEventListener('online', (e) => {
        observer.next(true);
      });
    });

    this.connectionMonitor.subscribe(isConnected => {
      if (isConnected) {
        this.internetConnectionStatus = "ONLINE";
        this.connectToHub();
        this.processQueueWebSocketMessages();
      }
      else {
        this.internetConnectionStatus = "OFFLINE";
      }
    });

    this._utilService.GetApiDateTime().then(resp => window.sessionStorage.setItem('lastWebSocketMessageReceived', resp));

    setInterval(() => this.checkStatusServices()
      , 30000);

  }

  async checkStatusServices() {
    if (this.hubConnectionStatus == 'OFFLINE' && this.internetConnectionStatus == "ONLINE") {
      //console.log('checkStatusServices connectToHub');
      await this.connectToHub();
      await this.processQueueWebSocketMessages();
    }
    //this.processQueueWebSocketMessages();
  }

  public sendToMessage(target: string[], type: string, payload: any, action: string) {
    const url = `${this.urlBase}message?owner=${this.hubId}`;
    let apiHeader = new HttpHeaders();
    const obj = {
      target: target,
      type: type,
      action: action,
      payload: payload
    }
    return this.http.post(url, obj, { headers: apiHeader, withCredentials: false }).toPromise();
  }

  setBoardData(value) {
    this.boardData.next(value);
  }

  getBoardData() {
    return this.boardData;
  }

  public connectToHub() {
    let serverUrl = this.urlBase;
    let server: string = serverUrl.replace("/api", "");

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(server + "notify")
      .configureLogging(signalR.LogLevel.None)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log("Connection BoardHub started!");
        let conn: any = this.hubConnection;
        let hubConnId: string = '';
        if (conn.connection.baseUrl.indexOf('localhost') > 0) {
          hubConnId = conn.connection.transport.webSocket.url;
        } else {
          hubConnId = conn.connection.transport.url;
        }
        this.hubConnectionStatus = "ONLINE";
        this.hubConnectionStatusOnOf.next('ONLINE');
        this.hubId = hubConnId.substring(
          hubConnId.indexOf("=") + 1,
          hubConnId.length
        );
        console.log(this.hubId);
        this.storageConfigurations.set('hubConnId', null);
      }, error => {
        console.log("Error while establishing connection to BoardHub :(");
        this.hubConnectionStatus = "OFFLINE";
        this.hubConnectionStatusOnOf.next('OFFLINE');
      })
    // .catch(err =>
    // );

    this.hubConnection.onclose(error => {
      this.hubConnectionStatus = "OFFLINE";
      this.hubConnectionStatusOnOf.next('OFFLINE');
      console.log('Connection Hub c', error);
      // this.storageConfigurations.get('connectionTick').then(connectionTick => {
      //     if (connectionTick == null) connectionTick = 0;
      //     console.log('Connection Hub', error);
      //     connectionTick = connectionTick + 1
      //     this.storageConfigurations.set('connectionTick', connectionTick);
      //     if (connectionTick < 5) this.connectToHub();
      // });
    });

    this.hubConnection.on(
      "BroadcastMessage",
      (type: string, payload, action: string, target: string[], postedOn) => {
        const message = {
          type: type,
          payload: payload,
          action: action,
          target: target
        }
        console.log("BroadcastMessage", message);
        window.sessionStorage.setItem('lastWebSocketMessageReceived', postedOn);
        this.hubNotification.next(message);
      }
    );
  }

  async processQueueWebSocketMessages() {
    let dateTime;
    await this._utilService.GetApiDateTime().then(resp => dateTime = resp);

    const lastWebSocketMessageReceived: any = window.sessionStorage.getItem('lastWebSocketMessageReceived');

    if (lastWebSocketMessageReceived != null) {
      await this._webSocketMessageService.getAfterDateTime(lastWebSocketMessageReceived).then(async messageList => {
        let boardMessages = await messageList.filter(msg => msg.target.filter(t => t == 'board').length == 1);
        if (boardMessages.length > 0) {
          messageList.forEach(item => {
            this.hubNotification.next(item);
          });
          window.sessionStorage.setItem('lastWebSocketMessageReceived', dateTime);
          // const updateNursing = await boardMessages.filter(m => m.payload.columns.filter(c => c == 'nursing').length == 1).length;
          // const updatePhysicians = await boardMessages.filter(m => m.payload.columns.filter(c => c == 'physicians').length == 1).length;
          // const otherColumns = await boardMessages.filter(m => m.payload.columns.filter(c => c == 'nursing').length == 0 && m.payload.columns.filter(c => c == 'physicians').length == 0);

          // let otherColumnsToUpdate: string = '';
          // let otherRowsToUpdate: string = '';

          // otherColumns.map(r => {
          //   r.payload.columns.map(e => {
          //     if (otherColumnsToUpdate.indexOf(e) == -1) {
          //       otherColumnsToUpdate += otherColumnsToUpdate != '' ? '|' + e : e;
          //     }
          //   });
          //   if (otherRowsToUpdate.indexOf(r.payload.stationId) == -1) {
          //     otherRowsToUpdate += otherRowsToUpdate != '' ? '|' + r.payload.stationId : r.payload.stationId;
          //   }
          // });

          // let cols: string = '';
          // if (updateNursing > 0) cols += 'nursing';
          // if (updatePhysicians > 0) cols += cols != '' ? '|' + 'physician' : '';

          // if (updateNursing > -1 || updatePhysicians > -1) {
          //   let contentToUpdate = {
          //     boardId: 1,
          //     columns: cols
          //   }
          //   this.winSockUpdateRows.next(contentToUpdate);

          // }

          // if (otherColumnsToUpdate != '' || otherRowsToUpdate != '') {
          //   let contentToUpdate = {
          //     boardId: 1,
          //     roomIds: otherRowsToUpdate,
          //     columns: otherColumnsToUpdate
          //   }
          //   this.winSockUpdateRows.next(contentToUpdate);
          // }
          // if (updateNursing > -1 || updatePhysicians > -1 || otherColumnsToUpdate != '' || otherRowsToUpdate != '') window.sessionStorage.setItem('lastWebSocketMessageReceived', dateTime);
        }
      })
        .catch(error => console.log(error));
    }
  }

  ngOnDestroy() {
    this.storageConfigurations.remove('connectionTick').then(removed => {

    })
  }
}