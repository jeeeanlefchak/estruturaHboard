import { Component, Input, OnInit, ElementRef, HostListener } from '@angular/core';
import { AssessmentTemplateParameterTemplate } from 'src/app/models/assessmentTemplateParameterTemplate';
import { AssessmentInstance } from 'src/app/models/assessmentInstance';
import { AssessmentParameterInstanceResult } from 'src/app/models/assessmentParameterInstanceResult';
import { CRUDAction } from 'src/app/models/publicEnums';
import { AssessmentParameterInstance } from 'src/app/models/assessmentParameterInstance';
import { AssessmentTemplateToParameterTemplatesService } from 'src/app/services/assessment-template-to-parameter-templates.service';

import { UnitService } from 'src/app/services/unit.service';
import { UnitConversionService } from 'src/app/services/shared/unit-conversion.service';
import { AssessmentInstanceService } from 'src/app/services/assessment-instance.service';
import { Patient } from 'src/app/models/patient';
import { AssessmentParameterTemplateToAssessmentTemplateService } from 'src/app/services/assessment-parameter-templete-to-assessment-templete.service';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'parameter-inputter',
  templateUrl: './parameter-inputter.component.html',
  styleUrls: ['./parameter-inputter.component.scss']
})
export class ParameterInputterComponent implements OnInit {
  @Input() assessmentInstance: AssessmentInstance;
  @Input() index: number;
  @Input() modeView: boolean;
  @Input('autoresize') maxHeight: number; // campo text area, expandir conforme digita
  weekDays: WeekDays = new WeekDays();
  changedUnit: any;
  public labelNumericValue: number = 0;
  public labelCompositeValue: any = {
    intPart: 0, decPart: 0
  };
  public finishedOnCreateComposite: boolean = false;
  public finishedOnCreateNumeric: boolean = false;
  public labelError: string = '';
  public numericValue: number = 0;
  weekInput: number;
  dayInput: number;
  time: Time = new Time();
  resultText: string;

  constructor(public element: ElementRef, private assessmentTemplateToParameterTemplatesService: AssessmentTemplateToParameterTemplatesService,
    private unitsService: UnitService, private unitConversionService: UnitConversionService, private _assessmentInstanceService: AssessmentInstanceService,
    private _assessmentParameterTemplateToAssessmentTemplateService: AssessmentParameterTemplateToAssessmentTemplateService, private _utilService: UtilService) {
  }

  ngOnInit() {
    this.setValues();
  }

  private async setValues() {
    switch (this.assessmentInstance.parameters[this.index].parameterTemplate.dataType) {
      case 1:
        debugger
        if (this.assessmentInstance.parameters[this.index].results) {
          if (this.assessmentInstance.parameters[this.index].results[0]) {
            if (!this.assessmentInstance.parameters[this.index].results[0].resultText) {
              this.assessmentInstance.parameters[this.index].results[0].resultText = "";
            }
          }
        }
        break;
      case 6: // precisa setar o formato de data
        if (this.assessmentInstance.parameters[this.index].results) {
          if (this.assessmentInstance.parameters[this.index].results[0].id != 0 && this.assessmentInstance.parameters[this.index].results[0].resultText) {
            this.setHourAndMinute();
          }
        }
        break;

      default:
        break;
    }
  }

  private setHourAndMinute() {
    const date: Date = new Date(this.assessmentInstance.parameters[this.index].results[0].resultText);
    this.time.minute = date.getMinutes();
    this.time.hour = date.getHours();
    this.time.hour = this.time.hour % 12;
    this.time.hour = this.time.hour ? this.time.hour : 12;
    let newDate = moment(date).format("YYYY-MM-DD hh:mm:ss a");
    this.time.AM = newDate.includes('am');
  }

  setText(args) {
    this.assessmentInstance.parameters[this.index].parameterTemplate['results'][0].resultText = args.target.textContent;
  }

  maxValueRange(options: any[]): number {
    return Math.max.apply(null, this.mountListToValues(options));
  }

  minValueRange(options: any[]): number {
    return Math.min.apply(null, this.mountListToValues(options));
  }

  selectedHourAndMinute(value, type) {
    if (type == 'HOUR') {
      this.time.hour = value;
      this.time.showMinutes = true;
    } else if (type == 'MINUTE') {
      this.time.minute = value;
      this.time.showMinutes = false;
    }
    let date = new Date();
    date.setHours(this.time.hour);
    date.setMinutes(this.time.minute ? this.time.minute : 0);
    let newDate = moment(date).format("YYYY-MM-DD hh:mm:ss a");
    let existis = newDate.includes('am');
    if (this.time.AM) {
      if (!existis) {
        newDate = newDate.replace('pm', 'am');
      }
    } else {
      if (existis) {
        newDate = newDate.replace('am', 'pm');
      }
    }
    console.log(newDate);
    this.assessmentInstance.parameters[this.index].results[0].resultText = newDate;
  }

  setValue(event) {
    this.assessmentInstance.parameters[this.index]['resultOption'] = event.detail.value;
  }

  updatePro(options, event) {
    options.forEach(option => {
      let value = option.value;
      if (option.value.indexOf('%') >= 0) {
        value = option.value.replace('%', '');
      }
      value = parseFloat(value);
      if (value - 0.5 < event.detail.value && value + 0.5 > event.detail.value) {
        // parameter = option;
        this.assessmentInstance.parameters[this.index]['resultOption'] = option;
      }
    });

    // parameter.resultOption = Math.round(event.detail.value);
  }

  stepValues(options: any[]): number {
    let value: number = 1;
    if (Math.min.apply(null, this.mountListToValues(options)) >= 0) {
      // condição valida somente para numeros positivos
      value = Math.max.apply(null, this.mountListToValues(options)) / (options.length - 1);
    } else {
      if (this.mountListToValues(options)[options.length - 2] != undefined) {
        value = this.mountListToValues(options)[options.length - 1] - this.mountListToValues(options)[options.length - 2];
      } else {
        value = 1
      }
    }
    return value
  }

  private mountListToValues(options) {
    let values = Object.assign([], options);
    let results = [];
    values.forEach(option => {
      if (option.value.indexOf('%') >= 0) {
        option.value = option.value.replace('%', '');
      }
      results.push(parseFloat(option.value));
    });
    return results
  }

  private executeActionsFromSettings() {
    this.assessmentInstance.parameters.forEach(param => {
      if (param.parameterTemplate.settings != undefined) {
        if (Object.keys(param.parameterTemplate.settings).find(key => key == 'actions') != undefined) {
          const actions: any = param.parameterTemplate.settings.actions;

          actions.forEach(action => {
            switch (action.name) {
              case 'GET_PARAMETER_RESULT':
                if (action.sourceType == 'API_SERVICE') {
                  let iParams = this.assessmentInstance.parameters.filter(p => action.params.indexOf(p.parameterTemplate.uid) >= 0);
                  let params: any[] = [];
                  if (iParams.length > 0) {
                    iParams.forEach(p => {
                      let pa: any = {};
                      pa.uid = p.parameterTemplate.uid;
                      pa.result = p.results[0];
                      params.push(pa);
                    });
                    this._utilService.postCustom(action.source, params).then(res => {
                      param.results[0].resultText = res;
                      param.results[0].resultValue = res;
                    }).catch(err => console.log(err));
                  }
                }
            }
          });
        }
      }
    });
    this.assessmentChanged();
  }

  assessmentChanged() {
    this.assessmentInstance.changed = true;
  }

  changeDaysAndWeeks(args: any) {
    this.assessmentInstance.parameters[this.index].results[0].resultText = this.convertWeeksToDays(this.weekDays).toString();
    // console.log(this.assessmentInstance.parameters[this.index].results[0].resultText);
    this.executeActionsFromSettings();
  }

  convertWeeksToDays(weekdays: WeekDays): number {
    let days: number;
    weekdays.days = weekdays.days == undefined ? 0 : weekdays.days;
    weekdays.weeks = weekdays.weeks == undefined ? 0 : weekdays.weeks;
    days = weekdays.weeks * 7;
    days = days + weekdays.days;
    return days;
  }

  convertDaysToWeeks(totalDays: number) {
    let weeks = totalDays / 7;
    let days = totalDays % 7;
    this.weekDays.weeks = Math.floor(weeks);
    this.weekDays.days = Math.ceil(days);
  }

  markItemSingle(option) {
    if (this.assessmentInstance.parameters[this.index].results) {
      if (this.assessmentInstance.parameters[this.index].results[0] == option) {
        let obj: any = [{ id: 0 }];
        this.assessmentInstance.parameters[this.index].results = obj;
        return
      }
    }

    let obj: any = {
      id: 0, resultOption: option, resultOptionId: option.id,
      resultText: option.name, resultValue: option.name, parameterInstanceId: this.assessmentInstance.parameters[this.index].id
    };
    this.assessmentInstance.parameters[this.index].results[0] = obj;
    this.executeActionsFromSettings();
  }

  markItemMulti(option) {
    let index = this.assessmentInstance.parameters[this.index].results.findIndex(x => x.resultOptionId == option.id);
    if (index < 0) index = this.assessmentInstance.parameters[this.index].results.findIndex(x => x['resultOptionID'] == option.id);
    if (index >= 0) {
      if (this.assessmentInstance.parameters[this.index].results[index].id == 0) {
        this.assessmentInstance.parameters[this.index].results.splice(index, 1);
      } else {
        this.assessmentInstance.parameters[this.index].results[index].crudAction = CRUDAction.Delete;
        // this.assessmentInstance.parameters[this.index].results.splice(index, 1);
      }
      option.checked = false;
    } else {
      let resultOption: AssessmentParameterInstanceResult = new AssessmentParameterInstanceResult();
      resultOption.crudAction = CRUDAction.Create;
      resultOption.editionId = 0;
      resultOption.resultOptionId = option.id;
      resultOption.resultText = option.name;
      resultOption.unitId = 0;
      resultOption.id = 0;
      resultOption.resultOption = option;
      resultOption.parameterInstanceId = this.assessmentInstance.parameters[this.index].id;
      this.assessmentInstance.parameters[this.index].results.push(resultOption);
      option.checked = true;
    }
    this.executeActionsFromSettings();
  }

  // ContextMenuAddInstanceShow(args: any) {
  //   this.assessmentInstance
  //   this.parameterTemplate
  //   this.assessmentInstance.parameters[this.index]
  //   debugger
  //   this._assessmentParameterTemplateToAssessmentTemplateService.getByParameterId(this.parameterTemplate.id).then(p => {

  //     this._assessmentInstanceService.getNew(this.assessmentInstance.parameters[this.index].id, 2, Number(this.patient.id)).then((res: any) => {
  //       let newInstance = res;

  //       newInstance.orderedOn = new Date();
  //       newInstance.touched = false;
  //       newInstance.changed = false;
  //       newInstance.regardingToType = 0;
  //       newInstance.assessmentTemplate.templateHash = res.assessmentTemplate.displayName.substring(0, 3) + new Date().getTime().toString();

  //       if (this.parameterInstance.assessmentInstances === undefined) this.parameterInstance.assessmentInstances = [];
  //       this.parameterInstance.assessmentInstances.push(newInstance);

  //       if (this.assessmentInstance.children === undefined) this.assessmentInstance.children = [];

  //       newInstance.assessmentInstanceToAssessmentInstances = [];
  //       let assessmentInstanceToAssessmentInstance: AssessmentInstanceToAssessmentInstance = new AssessmentInstanceToAssessmentInstance();
  //       assessmentInstanceToAssessmentInstance.counterPartId = this.assessmentInstance.id;
  //       assessmentInstanceToAssessmentInstance.crudAction = CRUDAction.Create;
  //       assessmentInstanceToAssessmentInstance.partId = newInstance.id;
  //       assessmentInstanceToAssessmentInstance.parameterInstanceId = this.parameterInstance.id;

  //       newInstance.assessmentInstanceToAssessmentInstances.push(assessmentInstanceToAssessmentInstance);

  //       this.assessmentInstance.children.push(newInstance);

  //       let result = { resultText: undefined };

  //     });
  //   });
  // }


  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.autoResize();
  }

  autoResize(): void {
    let ta = this.element.nativeElement.querySelector("textarea"), newHeight;
    if (ta) {
      ta.style.overflow = "hidden";
      ta.style.height = "auto";
      if (this.maxHeight) {
        newHeight = Math.min(ta.scrollHeight, this.maxHeight);
      } else {
        newHeight = ta.scrollHeight;
      }
      ta.style.height = newHeight + "px";
    }
  }

  async numericOnCreated(args: any) {

  }


}
export class WeekDays {
  weeks: number;
  days: number;
}


export class Time {
  hour: number;
  minute: number;
  showMinutes: boolean;
  AM: boolean = false;
};