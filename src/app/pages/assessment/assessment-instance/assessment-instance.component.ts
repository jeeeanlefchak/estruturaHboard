import { Component, NgModule, Inject, Input } from '@angular/core';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from 'src/app/services/shared/EventsService';
import { CRUDAction } from 'src/app/models/publicEnums';
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

  public loading: boolean = true;
  assessmentInstance: AssessmentInstance = new AssessmentInstance();
  assessmentInstances: AssessmentInstance[] = [];
  assessmentParams: AssessmentParams;
  public modeView: boolean = false;

  public data: any;
  viewTravando: boolean = false;

  constructor(public datepipe: DatePipe, @Inject('configurations') private storgeConfigurations: Storage,
    private assessmentInstanceService: AssessmentInstanceService, public toastController: ToastController,
    private sharedData: SharedDataService, private router: Router, private route: ActivatedRoute,
    private boardService: BoardService, private navCtrl: NavController) { }

  ngOnInit() {
    this.getModeView();
    this.storgeConfigurations.get('assessment').then(res => {
      res.action ? res.action : 'NEW';
      this.data = res;
      if (this.data.action == 'NEW') {
        this.getNew();
      } else {
        this.getEdit();
      }
      this.storgeConfigurations.remove('assessment').then();
    })
  }
  public getNew() {
    this.loading = true;
    this.assessmentInstanceService.getNewInstance(this.data.assessmentInstanceUid).then((assessment: AssessmentInstance) => {
      assessment.orderedOn = new Date(assessment.orderedOn).toISOString();
      this.assessmentInstance = assessment;
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
    this.assessmentInstanceService.getByIdLazyLoad(this.data.idCervicalExam).then((res: any) => {
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
      this.assessmentInstance = res;
    }, error => {
      this.loading = false;
      this.presentToast('error to edit Admissão');
    })
    // this.loadHistory();
  }

  // private loadHistory() {
  //   debugger
  //   this.assessmentInstanceService.getByUids(this.assessmentInstance[0].uid, this.assessmentInstance.objectId, this.data.room.id).then((instances: AssessmentInstance[]) => {
  //     instances.forEach(instance => {
  //       this.assessmentInstances.push(instance);
  //     });
  //   },error=>{
  //     // this.action.toast
  //   })
  // }


  // closeModal(newInstance) {
  //   this.modalControler.dismiss({ cervicalExam: newInstance, room: this.room });
  // }

  public onSubmit() {
    let newInstance = JSON.parse(JSON.stringify(this.assessmentInstance));
    newInstance.objectType = 2;
    newInstance.objectId = this.data.patient.id;
    newInstance.touched = true;
    newInstance.changed = true;
    delete newInstance.assessmentTemplate;
    for (let i = 0; i < newInstance.parameters.length; i++) {
      if (this.data.action.toUpperCase() == 'EDIT') {
        newInstance.parameters[i].crudAction = CRUDAction.Update;
        // newInstance.parameters[i].results[0]['crudAction'] = CRUDAction.Update;
      } else if (this.data.action.toUpperCase() == 'NEW') {
        newInstance.parameters[i].crudAction = CRUDAction.Create;
        // newInstance.parameters[i].results[0]['crudAction'] = CRUDAction.Create;
      }
      if (!newInstance.parameters[i].results[0]) {
        newInstance.parameters[i].results[0] = {};
      }
      if (newInstance.parameters[i].resultOption) {
        newInstance.parameters[i].results[0].resultOptionId = newInstance.parameters[i].resultOption.id;
        newInstance.parameters[i].results[0].resultText = newInstance.parameters[i].resultOption.value;
        delete newInstance.parameters[i].resultOption;
      }
    }

    if (this.data.action.toUpperCase() == "NEW") {
      newInstance.crudAction = CRUDAction.Create;
      this.assessmentInstanceService.postNewInstance(newInstance, this.data.admission.id).then((resp: any) => {
        // this.assessmentInstanceService.postRangeNewInstance([newInstance], this.data.admission.id).then((resp: any) => {
        this.sendToMessage('new');
        newInstance.id = resp.id;
        this.updateRow(this.data.currentRoom.id, this.data.rowUpdate);
        this.close();
      }).catch(error => {
        this.presentToast('Error to save')
        console.log("Error", error);
      });
    } else {
      newInstance.crudAction = CRUDAction.Update;
      this.assessmentInstanceService.putNewInstance(newInstance, newInstance.id).then(resp => {
        this.sendToMessage('update');
        this.updateRow(this.data.currentRoom.id, this.data.rowUpdate);
        this.close();
      }).catch(error => {
        console.log("Error", error);
        this.presentToast('Error to update')
      });
    }
  }

  public updateRow(idRoom: number, cloumn: string) {
    this.boardService.updateColumnByStationId(idRoom, cloumn).then(res => {
      console.log("ATUALIZOU COM SUCESSO !");
    })
  }

  sendToMessage(action) {
    const payload = { stationId: [this.data.currentRoom.id], columns: [this.data.rowUpdate] }
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

}


