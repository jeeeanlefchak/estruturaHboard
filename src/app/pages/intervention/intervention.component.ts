import { Component, OnInit, ViewChildren } from '@angular/core';
import { Admission } from 'src/app/models/admission';
import { Room } from 'src/app/models/room';
import { InterventionTemplate } from 'src/app/models/interventionTemplate';
import { InterventionGroup } from 'src/app/models/interventionGroup';
import { interventionTemplatesService } from 'src/app/services/intervention-templates.service';
import { InterventionInstancesService } from 'src/app/services/Intervention-intance.service';
import { InterventionInstance } from 'src/app/models/interventionInstance';
import { InterventionTemplateToGroupService } from 'src/app/services/Intervention-template-to-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
import { BoardRecord } from 'src/app/models/BoardRecord';
import { ToastController, NavController } from '@ionic/angular';
import { SharedDataService } from 'src/app/services/shared/sharedDate.service';
import { Patient } from 'src/app/models/patient';
import { CRUDAction } from 'src/app/models/publicEnums';

@Component({
  selector: 'app-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss']
})
export class InterventionComponent implements OnInit {
  admission: Admission;
  room: Room;
  private patient: Patient;
  patientInterventionList: InterventionTemplate[] = [];
  groupInterventionList: InterventionGroup[] = [];
  private allInterventionsSearch: InterventionTemplate[] = [];
  @ViewChildren('searchPatients') searchPatients;
  showSearchBar: boolean = false;
  loading: boolean = false;
  context = "patientInterventions";

  constructor(private interventionTplService: interventionTemplatesService, private interventionTemplateToGroupService: InterventionTemplateToGroupService,
    private interventionService: InterventionInstancesService, private route: ActivatedRoute, private boardService: BoardService,
    public toastController: ToastController, private navCtrl: NavController, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    // this.admission = this.sessionStorage.get('admission');
    // this.room = this.sessionStorage.get('currentRoom');

    this.getGroupsAndTemplates();

  }

  updateTemplatePatient(template) {
    if (template.crudAction) {
      let index = this.patientInterventionList.findIndex(x => x.id == template.id);
      if (template.crudAction == CRUDAction.Create) {
        template.crudAction = CRUDAction.Delete;
      } else if (template.crudAction == CRUDAction.Delete) {
        template.crudAction = CRUDAction.Create;
      }
      this.patientInterventionList[index]['crudAction'] = template['crudAction'];
    } else {
      template.crudAction = CRUDAction.Create;
      this.patientInterventionList.unshift(template);
    }
  }

  deleteItem(template) {
    template.crudAction = CRUDAction.Delete;
    for (let i = 0; i < this.groupInterventionList.length; i++) {
      let index = this.groupInterventionList[i].interventionTemplates.findIndex(x => x.id == template.id);
      if (index >= 0) {
        this.groupInterventionList[i].interventionTemplates[index]['crudAction'] = CRUDAction.Delete;
      }
    }
  }

  onSubmit() {
    const deleted = this.patientInterventionList.filter(x => x['crudAction'] == CRUDAction.Delete && x['existis'] != undefined);
    const news = this.patientInterventionList.filter(x => x['crudAction'] == CRUDAction.Create && x['existis'] == undefined);
    let interventions: InterventionInstance[] = [];
    let ids: number[] = [];
    news.forEach((template, index) => {
      let interventionInstance = new InterventionInstance();
      interventionInstance.templateId = template.id;
      interventionInstance.regardingToId = this.patient.id ? this.patient.id : this.admission.patientId;
      interventions.push(interventionInstance);
    });
    deleted.forEach((template, index) => {
      ids.push(template.id);
    });
    if (news.length == 0 && deleted.length == 0) {
      this.back(false);
    }
    if (interventions.length > 0) {
      this.interventionService.postRange(this.admission.id, interventions).then(res => {
        this.presentToast('Data saved', 200, 'success', true);
        this.boardService.updateColumnByStationId(this.room.id, 'interventions').then();
        this.back(true);
      }, error => {
        this.presentToast('Error to save', 200, 'danger', true);
      })
    }

    if (ids.length > 0) {
      this.interventionService.deleteRange(this.admission.id, ids).then(res => {
        if (interventions.length == 0) {
          this.presentToast('Data saved', 200, 'success', true);
          this.boardService.updateColumnByStationId(this.room.id, 'interventions').then();
          if (news.length == 0) {
            this.back(true);
          }
        }
      }, error => {
        this.presentToast('Error to delete', 200, 'danger', true);
      })
    }
  }

  private getGroupsAndTemplates() {
    this.loading = true;
    this.interventionTemplateToGroupService.GetGroupsAndTemplates().then((interventionGroup: InterventionGroup[]) => {
      this.groupInterventionList = interventionGroup;
      let allInterventionList: InterventionTemplate[] = [];
      this.groupInterventionList.forEach(intervention => {
        intervention.interventionTemplates.forEach(interventiontemplate => {
          allInterventionList.push(interventiontemplate);
        });
      });
      const groupAll = { name: 'All', interventionTemplates: allInterventionList, description: '', id: 0 };
      this.allInterventionsSearch = allInterventionList;
      this.groupInterventionList.unshift(groupAll);

      this.route.params.subscribe(params => {
        const stationId = +params["stationId"];
        this.boardService.getLocalRowByStationId(stationId).then((board: BoardRecord) => {
          this.room = board.room;
          this.admission = board.admission;
          this.patient = board.patient;
          this.getByAdmissionId();
        })
      });

    }, error => {
      this.loading = false;
      this.presentToast('Error to load interventions templates', 200, 'danger', true);
    })
  }

  private getByAdmissionId() {
    this.interventionTplService.getByAdmissionId(this.admission.id).then((templates: InterventionTemplate[]) => {
      templates.forEach(temp => {
        temp['existis'] = true;
      });
      this.patientInterventionList = templates;
      this.updateTableChecked(templates);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.presentToast('Error to load patient interventions', 200, 'danger', true);
    })
  }

  private updateTableChecked(templates: InterventionTemplate[]) {
    this.groupInterventionList.forEach(intervention => {
      intervention.interventionTemplates.forEach(interventiontemplate => {
        let existis = templates.find(x => x.id == interventiontemplate.id);
        if (existis) {
          interventiontemplate['crudAction'] = CRUDAction.Create;
        }
      });
    });
  }

  searchAllInterventions(event) {
    const val = event.target.value.toLowerCase();
    const filtered = this.allInterventionsSearch.filter(function (p) {
      return p.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    if (this.groupInterventionList) {
      this.groupInterventionList[0].interventionTemplates = filtered;
    }
  }

  back(update) {
    if (update) {
      const payload = { stationId: [this.room.id], columns: ['interventions'] };
      this.sharedDataService.sendToMessage(['board'], 'dataRow', payload, 'new').then();
    }
    this.navCtrl.pop();
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
}