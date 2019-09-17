import { Component, OnInit, Inject, ViewChildren } from '@angular/core';
import { InstitutionAndSector } from 'src/app/modals/modal-institution/institutionAndSector';
import { Storage } from '@ionic/storage';
import { BoardService } from 'src/app/services/board.service';
import { PlayerPositionOccupation } from 'src/app/models/playerPositionOccupation';
import { PlayerPositionService } from 'src/app/services/player-position.service';
import { EventService } from 'src/app/services/shared/EventsService';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
})
export class StaffPage extends InstitutionAndSector implements OnInit {
  context = "global";
  players: PlayerPositionOccupation[] = [];
  playerSearching: PlayerPositionOccupation[] = [];
  uidBoard = 'LABOR_AND_DELIVERY_DEFAULT';
  // private uidlastIndex: number = 0;
  showSearchBar: boolean = false;
  @ViewChildren('searchStaff') searchStaff;

  constructor(@Inject('configurations') storgeConfigurations: Storage, private boardService: BoardService,
    private playerPositionService: PlayerPositionService) {
    super(storgeConfigurations);

    EventService.get('updatePlayersNavBar').subscribe(res => {
      this.getSettingBoard();
    })
  }

  async ngOnInit() {
    await this.storgeConfigurations.get('navBarPlayers').then((res) => {
      if (!res) {
        this.getSettingBoard();
      } else {
        res.sort((a: any, b: any) => {
          return a.player.person.fullName < b.player.person.fullName ? -1 : 1;
        });
      }
      this.players = res;
      this.playerSearching = res;
    });
  }

  public async getSettingBoard(evt?) {
    this.playerSearching = [];
    this.players = [];
    await this.removePlayerLocal();
    await this.boardService.getBoardByUid(this.uidBoard).then((res: any) => {
      let uids: any = res.settings.configurations[0].navbar[0].displayPlayerPositionList;
      const uidlastIndex = uids.length;
      for (let i = 0; i < uids.length; i++) {
        this.getPlayerPositionOccupations(uids[i].uid, i, uidlastIndex, evt);
      }
    }, error => {
      if (evt) evt.target.complete();
    })
  }

  private async getPlayerPositionOccupations(uid, index, uidlastIndex, evt) {
    await this.playerPositionService.getOccupationByPosUID(uid).then(async (res: PlayerPositionOccupation[]) => {
      await res.forEach(item => {
        if (!this.playerSearching) this.playerSearching = [];
        if (!this.players) this.players = [];
        let exists = this.playerSearching.filter(x => x.playerId == item.playerId);
        if (exists.length == 0) {
          this.playerSearching.push(item);
          this.players.push(item);
        }
      });
      if (uidlastIndex - 1 === index) {
        if (evt) evt.target.complete();
        if (this.playerSearching) {
          this.playerSearching.sort((a: any, b: any) => {
            return a.player.person.fullName < b.player.person.fullName ? -1 : 1;
          });
        }
        this.savePlayersLocal();
      }
    }, error => {
      if (evt) evt.target.complete();
    })
  }

  private async savePlayersLocal() {
    await this.storgeConfigurations.set('navBarPlayers', this.players).then(() => {
      console.log('SALVOU NAVPLAYER');
    });
  }

  private async removePlayerLocal() {
    await this.storgeConfigurations.remove('navBarPlayers').then(() => {
      console.log('Player Removidos')
    });
  }

  async clickSegment(segment) {
    if (segment == "global") {

    } else if (segment == "groups") {

    }
  }

  public filter(event) {
    const val = event.target.value.toLowerCase();
    const filtered = this.players.filter(function (p) {
      return p.player.person.fullName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.playerSearching = filtered;

  }

  clickIconSearchBar() {
    this.showSearchBar = !this.showSearchBar
    if (this.showSearchBar) {
      setTimeout(() => {
        this.searchStaff.setFocus();
      }, 0);
    }
  }
}
