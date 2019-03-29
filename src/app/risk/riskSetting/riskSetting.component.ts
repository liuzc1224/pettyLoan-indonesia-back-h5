import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../share/table/table.model';

import { RiskListService } from '../../service/risk';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';
import {SearchModel} from './searchModel';

let __this;
@Component({
    selector: "",
    templateUrl: "./riskSetting.component.html",
    styleUrls: ['./riskSetting.component.less']
})
export class riskSettingComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private service: RiskListService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private sgo : SessionStorageService
    ) { };

    ngOnInit() {
        __this = this;

        this.getLanguage();

        this.validateForm = this.fb.group({
            "businessId": [null],
            "exemptionDays": [null, [Validators.required]],
            "status": [null],
            "activate": [null],
        });

    };

    languagePack: Object;
    searchModel : SearchModel = new SearchModel() ;
    validateForm: FormGroup;

    getLanguage() {
        this.translateSer.stream(["financeModule.list", 'reviewRiskList','common', 'riskModule', 'reviewRiskList.manageModule','reviewRiskList.riskSetting'])
            .subscribe(
                data => {
                    this.languagePack = {
                      common: data['common'],
                      data: data['financeModule.list'],
                      risk: data['riskModule'],
                      list:data['reviewRiskList'],
                      manage: data['reviewRiskList.manageModule'],
                      table:data['reviewRiskList.riskSetting']['table'],
                    };

                    this.initialTable();
                }
            )
    };

    tableData: TableData;

    initialTable() {
        this.tableData = {
            tableTitle: [
              {
                name: __this.languagePack['table']['number'],
                reflect: "id",
                type: "text"
              },
              {
                name: __this.languagePack['table']['name'],
                reflect: "functionName",
                type: "text"
              }, {
                name: __this.languagePack['table']['remarks'],
                reflect: "remark",
                type: "text"
              }, {
                name: __this.languagePack['table']['type'],
                reflect: "businessId",
                type: "text",
                filter:(item)=>{
                  let type=this.languagePack['list']['riskSetting']['type'];
                  let desc = type.filter(v => {
                    return v.value === item['businessId'];
                  });
                  return (desc && desc[0].desc) ? desc[0].desc : "no";
                }
              }, {
                name: __this.languagePack['table']['required'],
                reflect: "status",
                type: "text",
                filter: (item) => {
                  if(item['id']===5){
                    const status = item['status'];

                    const map = __this.languagePack['manage']['requiredType'];

                    let desc = map.filter(v => {
                      return v.value === status;
                    });
                    return (desc && desc[0].desc) ? desc[0].desc : "no";
                  }else{
                    return "";
                  }
                }
              }, {
                name: __this.languagePack['table']['status'],
                reflect: "activate",
                type: "text",
                filter: (item) => {
                    const activate = item['activate'];

                    const map = __this.languagePack['manage']['statusType'];

                    let desc = map.filter(v => {
                        return v.value === activate;
                    });
                    return (desc && desc[0].desc) ? desc[0].desc : "no";
                }

              }
            ],
            loading: false,
            showIndex: true,
            btnGroup: {
                title: __this.languagePack['common']['operate']['name'],
                data: [{
                    textColor: "#80accf",
                    name: __this.languagePack['common']['btnGroup']['a'],
                    // ico : "anticon anticon-pay-circle-o" ,
                    bindFn: (item) => {
                      this.selectItem = item;
                      ( item.id != 6 ) ? this.hidden=true : this.hidden=false;
                      this.validateForm.patchValue({
                        status: item.status,
                        businessId: item.businessId,
                        exemptionDays: item.exemptionDays,
                        activate: item.activate
                      });
                      this.riskSetMark = true;
                    }
                }]
            }
        };
        this.getList();
    };

    selectItem: object;
    riskSetMark: boolean = false;
    getList() {

        this.tableData.loading = true;
      let data=this.searchModel;
        this.service.getSetList(data)
            .pipe(
                filter((res: Response) => {
                    if (res.success !== true) {
                        this.msg.fetchFail(res.message);
                    };

                    this.tableData.loading = false;

                    if (res.data && res.data['length'] === 0) {
                        this.tableData.data = [];
                    };

                    return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
                })
            )
            .subscribe(
                (res: Response) => {

                    let data_arr = res.data;

                    this.tableData.data = (<Array<Object>>data_arr);

                }
            )
    };

    hidden:Boolean = false;

    makeNew(){
        let data = this.validateForm.value;
        if(this.hidden){
            this.makeLoan(data);
        }else{
            if (!data.exemptionDays) {
                let msg = this.languagePack['common']['tips']['notEmpty'];

                this.msg.operateFail(msg);
                return;
            }
            this.makeLoan(data);
        }
    }
    makeLoan(data){
        let postData = {
            'businessId': data.businessId,
            'status': data.status,
            'exemptionDays': data.exemptionDays || '0',
            'activate': data.activate
        }
        this.service.postFaceStatus(postData)
            .pipe(
            filter((res: Response) => {

                if (res.success !== true) {
                this.msg.operateFail(res.message);
                };
                return res.success === true;
            })
            )
            .subscribe(
            (res: Response) => {

                this.msg.operateSuccess();

                this.getList();

                this.riskSetMark = false;
            }
            );
    }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
};
