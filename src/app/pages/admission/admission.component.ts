import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
import { ToastController, Platform, ActionSheetController } from '@ionic/angular';
import { BoardRecord } from 'src/app/models/BoardRecord';
import { SharedDataService } from 'src/app/services/shared/sharedDate.service';
import { Storage } from '@ionic/storage';
import { PersonService } from 'src/app/services/person.service';
import { Attachment } from 'src/app/models/attachment';
import { AdmissionService } from 'src/app/services/admission.service';
import { FileService } from 'src/app/services/file.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/File/ngx';
@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss']
})
export class AdmissionComponent implements OnInit {

  data: BoardRecord;
  loadingData: boolean = false;
  public boardData: any;
  attachmentsData: Attachment[];

  constructor(private route: ActivatedRoute, private boardService: BoardService, private toastController: ToastController,
    private sharedService: SharedDataService, @Inject('configurations') private storgeConfigurations: Storage,
    private personService: PersonService, private admissionService: AdmissionService, private _fileService: FileService,
    private actionSheetCtrl: ActionSheetController, private fileTransfer: FileTransfer, private document: DocumentViewer,
    private router: Router, private platform: Platform, private file: File) {

    this.boardData = sharedService.boardData;
    this.boardData.subscribe((rows) => {
      if (rows && this.data) {
        this.data = rows.rowData.find(x => x.room.id == this.data.room.id);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const idRoom = +params['id'];
      this.getLocalRow(idRoom);
    });
  }

  private getLocalRow(stationId) {
    this.loadingData = true;
    this.boardService.getLocalRowByStationId(stationId).then((board: BoardRecord) => {
      this.data = board;
      this.loadingData = false;
      this.getColunsNotPresent(board);
      this.loadAttachments(board.admission.id);
    }, error => {
      this.loadingData = false;
      this.toast('Error to Load Station ');
    })
  }

  private getColunsNotPresent(board) {
    let columns: string = '';
    if (!board.membranes) columns = 'membranes'
    if (!board.delivery) columns.length > 0 ? columns += '|delivery' : 'delivery'
    if (!board.pain) columns.length > 0 ? columns += '|pain' : 'pain'
    if (!board.interventions) columns.length > 0 ? columns += '|interventions' : 'interventions'

    if (columns.length > 0) {
      this.boardService.getByRowData([board.room.id], [columns]).then(res => {
        if (res.length > 0) {
          let col = columns.split('|');
          col.forEach(colum => {
            board[colum] = res[0][colum];
          });
        }
        this.boardService.updateRowLocalByStationId(board);
      }, error => {
        this.toast('Error to Load column ');
      })
    }
  }


  async toast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      animated: true,
      showCloseButton: true,
      closeButtonText: 'Done',
      color: 'danger'
    });
    toast.present();
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

  async doRefresh(event) {
    await this.getBoardData();
    await event.target.complete();
  }

  private async getBoardData() {
    await this.boardService.getByRowData([this.data.room.id], ['']).then(async res => {
      this.data = res[0];
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
        }
      }
    });
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

  private loadAttachments(admissionId) {
    if (admissionId) {
      this.admissionService.getAttachmentsByAdmission(admissionId).then((attachment: Attachment[]) => {
        this.attachmentsData = attachment;
      }, error => {
        this.toast('Error to load attachment');
      })
    }
  }

  clickAttachmentName(args) {
    console.log(args)
    this._fileService.downloadFile(args.id).then(async blob => {
      let objetoURL = window.URL.createObjectURL(blob);
      // var link = document.createElement('a');
      // link.href = window.URL.createObjectURL(resp);
      // link.download = args.name;
      // link.click();
      let pathFile: string;
      if (this.platform.is("ios")) {
        console.log('ios detectado');
        pathFile = this.file.documentsDirectory; //cordova.file.dataDirectory;  externalDataDirectory
      } else {
        console.log('other platform');
        pathFile = this.file.externalDataDirectory; //cordova.file.dataDirectory;  externalDataDirectory
      }

      this.file.writeFile(pathFile, args.name, blob, { replace: true }).then((entry) => {
        console.log(pathFile, entry);
      }).catch((error) => {
        console.log('Erro criação arquivo PDF:');
        console.log(error);
      });
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Actions',
        buttons: [{
          text: 'Save',
          icon: 'save',
          handler: () => {
            const transfer: FileTransferObject = this.fileTransfer.create();
            let diretory = this.file.dataDirectory + args.name;
            transfer.download(pathFile, diretory.trim()).then(entry => {
              console.log('download complete: ' + entry.toURL());
            }, error => {
              console.log(error);
            });
          }
        }, {
          text: 'viwer',
          icon: 'viwer',
          handler: () => {
            const options: DocumentViewerOptions = {
              title: 'My PDF'
            }
            this.document.viewDocument(pathFile, 'application/pdf', options);
          }
        }]
      });
      await actionSheet.present();

    }, error => {

    });
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }
}
