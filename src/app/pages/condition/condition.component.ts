import { Component, OnInit, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { ConditionTemplateGroup } from 'src/app/models/conditionTemplateGroup';
import { ConditionTemplateGroupService } from 'src/app/services/condition-template.group.service';
import { ActivatedRoute } from '@angular/router';
import { BoardRecord } from 'src/app/models/BoardRecord';
import { BoardService } from 'src/app/services/board.service';
import { AdmissionService } from 'src/app/services/admission.service';
import { ConditionService } from 'src/app/services/condition-instance.service';
import { ToastController, NavController } from '@ionic/angular';
import { Condition } from 'src/app/models/condition';
import { CRUDAction, IndexType } from 'src/app/models/publicEnums';
import { ConditionInstanceIndexesService } from 'src/app/services/condition-instance-index.service';
import { ConditionInstanceIndex } from 'src/app/models/conditionInstanceIndex';
import { ConditionTemplate } from 'src/app/models/conditionTemplate';
import { Patient } from 'src/app/models/patient';
import { SharedDataService } from 'src/app/services/shared/sharedDate.service';
import { ConditionPresenceService } from 'src/app/services/condition-presence.service';
import { ConditionPresence } from 'src/app/models/conditionPresence';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {
  conditionGroups: ConditionTemplateGroup[] = [];
  conditionGroupsSearch: ConditionTemplateGroup[] = [];
  patientConditionList: Condition[] = [];
  context = "patientConditions";
  @ViewChildren('searchPatients') searchPatients;
  showSearchBar: boolean = false;
  indexes: ConditionInstanceIndex[] = [];
  private patient: Patient;
  private roomId: number;
  private admissionId: number;
  loadingConditionAndGroup: boolean = false;
  loadingConditionPatient: boolean = false;

  constructor(private conditionTemplateGroupsService: ConditionTemplateGroupService, private route: ActivatedRoute,
    private boardService: BoardService, private admissionService: AdmissionService, private conditionService: ConditionService,
    private toastController: ToastController, private _conditionIndexService: ConditionInstanceIndexesService,
    private sharedData: SharedDataService, private conditionPresencesService: ConditionPresenceService, private navCtrl: NavController,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.getAllConditionsGroups();
  }

  private getAllConditionsGroups() {
    this.loadingConditionAndGroup = true;
    this.conditionTemplateGroupsService.getAllGroupsAndTemplates().then((conditionGroups: ConditionTemplateGroup[]) => {
      this.conditionGroups = conditionGroups.sort((a: any, b: any) => {
        return a.sortOrder < b.sortOrder ? -1 : 1;
      });
      this.conditionGroupsSearch = conditionGroups;
      this.loadingConditionAndGroup = false;
      this.route.params.subscribe(params => {
        const stationId = +params["stationId"];
        this.boardService.getLocalRowByStationId(stationId).then((board: BoardRecord) => {
          this.patient = board.patient;
          this.roomId = board.room.id;
          this.admissionId = board.admission.id;
          if (board.admission) {
            this.getConditionsPatientByAdmissionId(board.admission.id);
          } else {
            this.presentToast('Patient is not admission', 3500, 'warning', true);
          }
        })
      });
    }, error => {
      this.loadingConditionAndGroup = false;
      this.presentToast('Error to load conditions', 300, 'danger', true);
    })
  }

  getConditionsPatientByAdmissionId(admissionId) {
    this.loadingConditionPatient = true;
    this.admissionService.getConditionsByAdmission(admissionId, 1).then(async (conditions: Condition[]) => {
      // let conditionIndex: number = 0;
      this.loadingConditionPatient = false;
      if (conditions) {
        if (conditions.length > 0) {
          let conditionIndex: number = 0;
          conditions = conditions.filter(x => x.id && x.conditionTemplate.uid != 'PREGNANCY');
          conditions.forEach(async item => {
            this.conditionService.getPresencesById(item.id).then(async res => {
              let index = 0;
              let initialLen = -1;
              if (res) {
                initialLen = res.length;
                res.forEach((presence: ConditionPresence) => {
                  if (presence.presenceEnd) {
                    index++;
                  } else {
                    item.presences.push({ ...presence });
                    index++;
                  }
                  if (index >= initialLen) {
                    if (item.presences.length > 0) {
                      this.patientConditionList.push({ ...item });
                    }
                  }
                });
              }
              if (conditionIndex == conditions.length - 1) {
                //       // this.sortInstanceIndexes();
                // this.patientConditionList = conditions;
                this.markInterventionsPatientInGroups();
                console.log(this.patientConditionList);
              } else {
                conditionIndex++;
              }
            })
          });
        }
      }
    }, error => {
      this.loadingConditionPatient = false;
      this.presentToast('Error to load patient conditions ', 300, 'danger', true);
    })
  }

  markInterventionsPatientInGroups() {
    this.patientConditionList.forEach((condition: Condition) => {
      this.conditionGroups.forEach(conditionGroup => {
        let conditionsTemplate = conditionGroup.conditionTemplates.filter(x => x.id == condition.conditionTemplateId)
        conditionsTemplate.forEach(item => {
          item.crudAction = CRUDAction.Create;
        });
        let patientCond = this.patientConditionList.filter(x => x.conditionTemplateId == condition.conditionTemplateId)
        patientCond.forEach(item => {
          item['existis'] = true;
        });
      });
      this.conditionGroups = this.conditionGroupsSearch;
    });
  }

  // sortInstanceIndexes() {
  //   this.addInstanceIndexes();
  //   this.patientConditionList.sort((a, b) => a.index - b.index);
  // }

  // addInstanceIndexes() {
  //   //ao inves de c.index será c.conditionInstanceIndex.index
  //   this.patientConditionList.forEach(c => {
  //     if (c.index == 9999 || c.index == undefined || c.index == null) {
  //       c.index = this.patientConditionList.indexOf(c);
  //       c.lastIndex = 9999;
  //     }
  //   });
  // }

  changeItem(conditionTemplate) {
    let crudAction = null;
    if (conditionTemplate.crudAction) {
      if (conditionTemplate.crudAction == CRUDAction.Create) {
        conditionTemplate.crudAction = CRUDAction.Delete;
        crudAction = CRUDAction.Delete;
      } else if (conditionTemplate.crudAction == CRUDAction.Delete) {
        conditionTemplate.crudAction = CRUDAction.Create;
        crudAction = CRUDAction.Create;
      }
    } else {
      conditionTemplate.crudAction = CRUDAction.Create;
      crudAction = CRUDAction.Create;
    }
    let index = this.patientConditionList.findIndex(x => x.conditionTemplate.id == conditionTemplate.id);
    if (index >= 0) {
      this.patientConditionList[index].crudAction = crudAction;
    } else {
      let condi = new Condition();
      condi.regardingToCode = this.patient.id;
      condi.regardingToType = 1;
      condi.conditionTemplateId = conditionTemplate.id;
      condi.conditionTemplate = conditionTemplate;
      condi.crudAction = crudAction;
      this.patientConditionList.unshift(condi);
    }
    this.sortInstanceIndexes();
    this.ref.detectChanges();
  }

  sortUp(condition: Condition) {
    for (let i = 0; i < this.patientConditionList.length; i++) {
      if (this.patientConditionList[i].id == condition.id) {
        if (i == 0) return
        let condition1 = this.patientConditionList[i];
        let condition2 = this.patientConditionList[i - 1];
        condition1.index = i - 1;
        condition2.index = i;
        this.patientConditionList[i - 1] = condition1;
        this.patientConditionList[i] = condition2;
        this.sortInstanceIndexes();
        break;
      }
    }
    this.patientConditionList.forEach((condition, index) => {
      condition.index = index;
    });
  }

  sortDown(condition: Condition) {
    for (let i = 0; i < this.patientConditionList.length; i++) {
      if (this.patientConditionList[i].id == condition.id) {
        if (this.patientConditionList.length - 1 == 0) return
        let condition1 = this.patientConditionList[i];
        let condition2 = this.patientConditionList[i + 1];
        condition1.index = i + 1;
        condition2.index = i;
        this.patientConditionList[i + 1] = condition1;
        this.patientConditionList[i] = condition2;
        this.sortInstanceIndexes();
        break;
      }
    }
    this.patientConditionList.forEach((condition, index) => {
      condition.index = index;
    });
  }

  async onSubmit() {
    let conditionsToSave = this.patientConditionList.filter(x => x.crudAction != 4 && !x['existis']);
    let conditionsToDelete = this.patientConditionList.filter(x => x.crudAction == 4 && x['existis']);

    if (conditionsToSave.length > 0) {
      this.conditionService.postRange(this.admissionId, conditionsToSave).then(res => {
        let newIndex: ConditionInstanceIndex = new ConditionInstanceIndex();
        res.forEach(instance => {
          let found = conditionsToSave.find(
            x => x.conditionTemplate.id == instance.conditionTemplateId
          );
          if (found) {
            newIndex.conditionInstanceId = instance.id;
            newIndex.position = found.index;
            newIndex.type = IndexType.BoardDisplay;
            this.indexes.push({ ...newIndex });
          }
        });
        this._conditionIndexService.postRange(this.indexes).then(r => {
          console.log("Indexes postados corretamente: ", r);
          this.sendToMessage('new');
          this.navCtrl.pop();
        })
      });
    }
    if (conditionsToDelete.length > 0) {
      //se for uma remoção de condition
      //Chamar o service de fechar condition presences, passar o id e setar a data fim com a data 'atual'
      // Voltar para a tela do board com location.back();
      let data = new Date();
      let offsetTz = data.getTimezoneOffset() * 60000; // pega o offset timezone em ms
      let dataISO = new Date(Date.now() - offsetTz).toISOString();
      // console.log('Data de presença fechada: ',dataISO);
      await conditionsToDelete.forEach(async item => {
        await this.conditionPresencesService.setPresenceEnd(item.presences[0].id, dataISO).then(async res => {

        });
      });
      this.sendToMessage('update');
      this.navCtrl.pop();
    }
  }

  deleteCondition(condition: Condition) {
    condition.crudAction = CRUDAction.Delete;
    for (let i = 0; i < this.conditionGroups.length; i++) {
      let index = this.conditionGroups[i].conditionTemplates.findIndex(x => x.id == condition.conditionTemplate.id);
      if (index >= 0) {
        this.conditionGroups[i].conditionTemplates[index].crudAction = CRUDAction.Delete;
        break;
      }
    }
  }


  close() {

  }

  sortInstanceIndexes() {
    this.addInstanceIndexes();
    this.patientConditionList.sort((a, b) => a.index - b.index);
  }

  addInstanceIndexes() {
    //ao inves de c.index será c.conditionInstanceIndex.index
    this.patientConditionList.forEach(c => {
      if (c.index == 9999 || c.index == undefined || c.index == null) {
        c.index = this.patientConditionList.indexOf(c);
        c.lastIndex = 9999;
      }
    });
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

  async clickSegment(segment) {

  }

  clickIconSearchBar() {
    this.showSearchBar = !this.showSearchBar
    if (this.showSearchBar) {
      setTimeout(() => {
        this.searchPatients.setFocus();
      }, 0);
    }
  }

  cancelSearch(evt) {
    this.showSearchBar = false;
  }

  searchAllInterventions(event) {
    // const val = event.target.value.toLowerCase();
    // const filtered = this.allInterventionsSearch.filter(function (p) {
    //   return p.name.toLowerCase().indexOf(val) !== -1 || !val;
    // });
    // if (this.groupInterventionList) {
    //   this.groupInterventionList[0].interventionTemplates = filtered;
    // }
  }

  sendToMessage(action) {
    const payload = { stationId: [this.roomId], columns: ['conditions'] }
    this.sharedData.sendToMessage(['board'], 'dataRow', payload, action).then();
  }

}

// enum Action {
//   NEW = 1,
//   UPDATE = 2,
//   DELETE = 3
// }

