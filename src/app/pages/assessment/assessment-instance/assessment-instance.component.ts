import { Component, Inject } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { CRUDAction, ExecuteActionWhen } from 'src/app/models/publicEnums';
import { AssessmentInstance } from 'src/app/models/assessmentInstance';
import { AssessmentParams } from 'src/app/models/assessmentParams';
import { AssessmentInstanceService } from 'src/app/services/assessment-instance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared/sharedDate.service';
import { Storage } from '@ionic/storage';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'assessment-instance',
  templateUrl: './assessment-instance.component.html',
  styleUrls: ['./assessment-instance.component.scss']
})
export class AssessmentInstanceComponent {
  slideOpts = {
    effect: 'flip'
  };
  saving: boolean = false;
  loading: boolean = true;
  assessmentInstance: AssessmentInstance = new AssessmentInstance();
  assessmentInstances: AssessmentInstance[] = [];
  param: AssessmentParams;
  modeView: boolean = false;
  viewTravando: boolean = false;

  private sendItemsExtrada = { assessmentInstanceUid: '', admissionId: 0, itemsCrudAction: [{ assessmentId: 0, crudAction: 0 }] };

  constructor(public datepipe: DatePipe, @Inject('configurations') private storgeConfigurations: Storage,
    private assessmentInstanceService: AssessmentInstanceService, public toastController: ToastController,
    private sharedData: SharedDataService, private router: Router, private route: ActivatedRoute,
    private boardService: BoardService, private navCtrl: NavController) { }

  ngOnInit() {
    this.getModeView();
    this.storgeConfigurations.get('assessment').then(res => {
      res.action ? res.action : 'NEW';
      this.param = res;
      console.log("PARAM", this.param);
      if (this.param.action == 'NEW') {
        this.getNew();
      } else {
        this.getEdit();
      }
      this.storgeConfigurations.remove('assessment').then();
    })
  }
  public getNew() {
    this.loading = true;
    this.assessmentInstanceService.getNewInstance(this.param.assessmentInstanceUid, this.param.objectType, this.param.objectId, this.param.admissionId).then((assessment: AssessmentInstance) => {
      assessment.orderedOn = new Date(assessment.orderedOn).toISOString();
      assessment.changed = true;
      this.assessmentInstances.push(assessment);
      this.assessmentInstance = this.assessmentInstances[0];
      this.loading = false;
      setTimeout(() => {
        this.viewTravando = true;
      }, 350);
    }, error => {
      this.loading = false;
      this.presentToast('error to create Admission');
    })
  }

  public getEdit() {
    this.loading = true;
    this.assessmentInstanceService.getByIdLazyLoad(this.param.id).then((res: any) => {
      for (let i = 0; i < res.parameters.length; i++) {
        if (res.parameters[i].parameterTemplate.options && res.parameters[i].results[0]) {
          for (let w = 0; w < res.parameters[i].parameterTemplate.options.length; w++) {
            if (res.parameters[i].results[0].resultOptionId == res.parameters[i].parameterTemplate.options[w].id) {
              res.parameters[i].resultOption = res.parameters[i].parameterTemplate.options[w];
              break;
            }
          }
        } else {
          res.parameters[i].results[0] = {};
        }
      }
      this.loading = false;
      this.assessmentInstances.push(res);
    }, error => {
      this.loading = false;
      this.presentToast('error to load');
    })
  }


  async onSubmit() {
    this.saving = true;
    let saveMessages: any[] = []
    const itemsToDelete = this.assessmentInstances.filter(x => x.deletedOn && x.id != 0);
    const itemsToSave = await this.prepareItemsToSave(JSON.parse(JSON.stringify(this.assessmentInstances.filter(x => !x.deletedOn && (!x.id || x.id == 0 || x.changed)))));

    itemsToSave.forEach(newInstance => {
      let executeWarning: boolean = false;
      newInstance.parameters.map(param => {
        if (param.parameterTemplate.required) {
          if (param.results.length == 0) {
            saveMessages.push({ name: param.parameterTemplate.displayName, message: 'Is required!' });
            executeWarning = true;
          } else {
            if (!param.results[0].resultText) {
              saveMessages.push({ name: param.parameterTemplate.displayName, message: 'Is required!' });
              executeWarning = true;
            }
          }
        }
      })
      if (executeWarning) {
        let assessment = this.assessmentInstances.find(x => new Date(x.orderedOn).toISOString() == new Date(newInstance.orderedOn).toISOString());
        if (assessment) {
          assessment['warning'] = true;
        }
      }
    });

    if (saveMessages.length == 0) {
      if (itemsToSave.length > 0) {

        let resp = await this.postRangeInstance(itemsToSave, this.param.admissionId);
        // PARA ATUALIZAR EM OUTRO TERMINAL
        let assessAfterList = this.assessmentInstances.filter(x => !x.deletedOn);
        let assessmentsIdsToAfterUpdate: AssessmentInstance[] = [];
        resp.forEach(resp => {
          for (let item of itemsToSave) {
            if (new Date(item.orderedOn).toISOString() == new Date(resp.orderedOn).toISOString()) {
              if (!this.sendItemsExtrada.itemsCrudAction) this.sendItemsExtrada.itemsCrudAction = [];
              this.sendItemsExtrada.itemsCrudAction.push({ assessmentId: resp.id, crudAction: item.crudAction });
            }
          }
        });

        assessAfterList.forEach(assess => {
          if (assess.id == 0) {
            for (let assesSaved of resp) {
              if (new Date(assesSaved.orderedOn).toISOString() == new Date(assess.orderedOn).toISOString()) {
                assess.id = assesSaved.id;
                assess.crudAction = CRUDAction.Create;
              }
            }
          }
          let found = assessmentsIdsToAfterUpdate.find(x => x.assessmentTemplateId == assess.assessmentTemplateId); // só deve inserir o primeiro de cada assessment!!
          if (!found) {
            assessmentsIdsToAfterUpdate.push(assess);
          }
        });

        assessmentsIdsToAfterUpdate.forEach(async (assessAfterUpdate) => {
          let actionWhen: ExecuteActionWhen = ExecuteActionWhen.AfterInsert;
          if (assessAfterUpdate.crudAction == CRUDAction.Create) {

          } else {
            actionWhen = ExecuteActionWhen.AfterUpdate;

          }

          await this.postExecutActions(assessAfterUpdate.id, actionWhen, this.param.admissionId);
        });
      }
      if (itemsToDelete.length > 0) {
        await this.deleteRangeInstances(this.prepareIdsToDelete(itemsToDelete));
        for (let item of itemsToDelete) {
          if (!this.sendItemsExtrada.itemsCrudAction) this.sendItemsExtrada.itemsCrudAction = [];
          this.sendItemsExtrada.itemsCrudAction.push({ assessmentId: item.id, crudAction: CRUDAction.Delete });
        }
      }

      this.sendToMessage('update');
      this.updateRow(this.param.room.id, this.sharedData.getColumnNameByAssessmentUid(this.param.assessmentInstanceUid));
      this.close();

    } else {
      saveMessages.map(m => {
        this.presentToast(m.name + m.message);
      });
      this.saving = false;
      return;
    }
  }

  private prepareIdsToDelete(assessments): number[] {
    let ids: number[] = [];
    assessments.forEach(assessment => {
      let deleteItem: boolean = true;
      if (assessment['itemUpdated']) {
        if (assessment['itemUpdated'] == CRUDAction.Delete) {
          deleteItem = false;
        }
      }
      if (deleteItem) {
        ids.push(assessment.id)
      }
    });
    return ids
  }

  public updateRow(idRoom: number, cloumn: string) {
    this.boardService.updateColumnByStationId(idRoom, cloumn).then(res => {
      console.log("ATUALIZOU COM SUCESSO !");
    })
  }

  sendToMessage(action) {
    const payload = { stationId: [this.param.room.id], columns: [this.sharedData.getColumnNameByAssessmentUid(this.param.assessmentInstanceUid)] }
    this.sharedData.sendToMessage(['board'], 'dataRow', payload, action).then();
  }

  formatId(data) {
    let formatted;
    let z;
    z = z || '0';
    data = data + '';
    formatted = data.length >= 6 ? data : new Array(6 - data.length + 1).join(z) + data;

    return formatted.slice(0, 3) + ',' + formatted.slice(3);
  }

  close() {
    this.navCtrl.pop();
    // this.router.navigate(['tabs/patients']);
    // EventService.get('cervicalexam').emit({ cervicalExam: newInstance, stationId: this.data.stationId });
  }

  private prepareItemsToSave(assessmentInstances: any[]): AssessmentInstance[] {
    console.log('this.param', this.param)
    let itemsToSave: AssessmentInstance[] = [];
    assessmentInstances.forEach(newInstance => {
      let inertIntem: boolean = true;
      if (newInstance['itemUpdated']) {
        if (newInstance['itemUpdated'] == CRUDAction.Delete) {
          inertIntem = false;
        }
      }
      if (inertIntem) {
        newInstance.objectType = this.param.objectType;
        newInstance.objectId = this.param.objectId;
        //newInstance.assessmentLabelId = newInstance.assessmentLabelId;
        delete newInstance.assessmentTemplate;
        for (let i = 0; i < newInstance.parameters.length; i++) {
          if (this.param.action.toUpperCase() == 'EDIT') {
            newInstance.parameters[i].crudAction = CRUDAction.Update;
          } else if (this.param.action.toUpperCase() == 'NEW') {
            newInstance.parameters[i].crudAction = CRUDAction.Create;
          }
          if (newInstance.parameters[i].resultOption) {
            delete newInstance.parameters[i].resultOption;
          }
          if (newInstance.parameters[i].results) {
            newInstance.parameters[i].results.forEach(res => {
              res.parameterInstanceId = newInstance.parameters[i].id;
              if (res.id < 0) {
                res.id = 0;
              }
            });
          }
        }
        if (newInstance.id == 0) {
          newInstance.crudAction = CRUDAction.Create;
        } else {
          newInstance.crudAction = CRUDAction.Update;
        }
        itemsToSave.push(newInstance);
      }
    });
    return itemsToSave;
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      animated: true,
    });
    toast.present();
  }

  setModView(value: boolean) {
    value ? value : false;
    this.storgeConfigurations.set('modeViewAssessment', value = !value).then(res => {
    })
  }

  async getModeView() {
    await this.storgeConfigurations.get('modeViewAssessment').then(res => {
      this.modeView = res;
    }, error => {
      this.modeView = true;
    })
  }


  private postExecutActions(id, actionWhen, admissionId) {
    return new Promise<any>(async (resolve, reject) => {
      this.assessmentInstanceService.executeActions(id, actionWhen, admissionId).then(res => {
        resolve();
      }, error => {
        resolve();
      });
    });
  }

  private postRangeInstance(itemsToSave, admissionId) {
    return new Promise<AssessmentInstance[]>(async (resolve, reject) => {
      this.assessmentInstanceService.postRangeNewInstance(itemsToSave, admissionId).then((resp: AssessmentInstance[]) => {
        resolve(resp);
      }, error => {
        this.presentToast('error to create assessment');
        reject();
      });
    });
  }

  private deleteRangeInstances(ids: number[]) {
    return new Promise<AssessmentInstance[]>(async (resolve, reject) => {
      this.assessmentInstanceService.deleteRange(ids).then(res => {
        resolve();
      }, error => {
        this.presentToast('error to delete assessment');
        reject();
      })
    })
  }
}


