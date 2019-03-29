import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Adaptor } from '../../share/tool';
import { TableData } from '../../share/table/table.model';
import { dataFormat } from '../../format';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { OrderListService } from '../../service/order';
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
import { DateObjToString } from '../../format';

let __this;
@Component({
    selector : "loan-list" ,
    templateUrl : './boleto.component.html' ,
    styleUrls : ['./boleto.component.less']
})
export class BoletoComponent implements OnInit{
    constructor(
        private translateSer: TranslateService ,
        private msg : CommonMsgService ,
        private orderSer : OrderListService ,
        private sgo : SessionStorageService ,
        private router : Router
    ) {};

    ngOnInit(){
      __this=this;
      this.getLanguage() ;
    };
    statusEnum : Array< { name :string , value : number} > ;

    languagePack : Object ;


    getLanguage(){
        this.translateSer.stream(["orderModule.boleto" , 'common'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common : data['common'] ,
                        table:data['orderModule.boleto']['table']
                    };
                    this.initialTable() ;
                }
            )
    };

    tableData : TableData ;
    initialTable(){
        const Table = this.languagePack['table'] ;
        this.tableData = {
            loading : false ,
            showIndex : true,
            tableTitle : [
                {
                    name : Table['orderNo'] ,
                    reflect : "creditOrderNo" ,
                    type : "text" ,
                },{
                    name : Table['periodsNumber'] ,
                    reflect : "orderNo" ,
                    type : "text" ,
                },{
                    name : Table['boletoNumber'] ,
                    reflect : "createTimeStr" ,
                    type : "text" ,
                },{
                    name : Table['repayMoneyShould'] ,
                    reflect : "userId" ,
                    type : "text" ,
                },{
                    name : Table['repayTimeShould'] ,
                    reflect : "userName" ,
                    type : "text" ,
                },{
                    name : Table['orderSource'] ,
                    reflect : "auditMoney" ,
                    type : "text" ,
                },
                {
                    name : Table['operationEmployeeName'] ,
                    reflect : "loanDays" ,
                    type : "text"
                },{
                    name : Table['applyTime'] ,
                    reflect : "payDateStr" ,
                    type : "text",
                },{
                    name : Table['status']  ,
                    reflect : "currentPeriod" ,
                    type : "text"
                }
            ] ,
            btnGroup: {
              title: __this.languagePack['data']['opera']['operate'],
              data: [{
                textColor: '#0000ff',
                name: __this.languagePack['data']['orderDetails'],
                bindFn: (item) => {
                  this.router.navigate(['/order/detail'], {
                    queryParams: {
                      order: item['id'],
                      userId: item['userId'],
                    }
                  });
                }
              }]
            }
        };
        this.getList() ;
    };
    totalSize : number ;
    getList(){
        let data = {} ;
        this.orderSer.getList(data)
        .pipe(
            filter( ( res : Response) => {
                if(res.success !== true){
                    this.msg.fetchFail(res.message) ;
                }
                this.tableData.loading = false ;

                if(res.data && res.data['length'] === 0){
                    this.tableData.data = [] ;
                    this.totalSize = 0 ;
                }
                return res.success === true  && res.data && (< Array<Object>>res.data).length > 0 ;
            })
        )
        .subscribe(
            ( res : Response ) => {
                let data_arr = res.data ;
                console.log(res.data);
                this.tableData.data = ( <Array< Object > >data_arr );
            }
        )
    };
}
