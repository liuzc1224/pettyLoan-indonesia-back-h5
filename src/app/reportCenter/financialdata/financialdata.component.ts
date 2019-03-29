import {Component, OnInit} from '@angular/core';
import {dataFormat, DateObjToString} from '../../format';
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {CommonMsgService} from '../../service/msg/commonMsg.service';
import {Response} from '../../share/model/reponse.model';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {channelDataService} from '../../service/report';

let __this;

@Component({
  selector: '',
  templateUrl: './financialdata.component.html',
  styleUrls: ['./financialdata.component.less']
})
export class financialdataComponent implements OnInit {

  constructor(
    private msg: CommonMsgService,
    private translateSer: TranslateService,
    private service : channelDataService ,
  ) {
  };

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  totalSize: number = 0;
  tableData: TableData;

  getLanguage() {
    this.translateSer.stream(['reportModule.financialdata', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['reportModule.financialdata'],
          };
          // this.initTable();
        }
      );
  }
  initTable(){
    this.tableData = {
      showIndex: true,
      loading: false,
      tableTitle: [
        {
          name: this.languagePack['data']['tabData']['month'],
          reflect: 'creditOrderNo',
          type: 'text'
        },
        {
          name: this.languagePack['data']['tabData']['withdrawNumber'],
          reflect: 'orderNo',
          type: 'text'
        },{
          name: this.languagePack['data']['tabData']['withdrawLumpsum'],
          reflect: 'loanType',
          type: 'text'
        }, {
          name: this.languagePack['data']['tabData']['loanNumber'],
          reflect: 'userPhone',
          type: 'text',
        }, {
          name: this.languagePack['data']['tabData']['loanLumpsum'],
          reflect: 'userName',
          type: 'text',
        }, {
          name: this.languagePack['data']['tabData']['settleNumber'],
          reflect: 'totalPeriod',
          type: 'text'
        }, {
          name: this.languagePack['data']['tabData']['repaymentLumpsum'],
          reflect: 'currentRepay',
          type: 'text'
        }
      ]
    };
    this.getList();
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  search() {
    this.getList();
  };
  getList() {
    this.tableData.loading = true ;
    let data={
      "time":this.searchModel.time,
      "columns":this.searchModel.columns,
      "orderBy":this.searchModel.orderBy
    } ;
    this.service.getData(data)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false ;
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          console.log(res);
          // if(res.page){
          //   this.totalSize = res.page["totalNumber"] ;
          // }
        }
      );
  }
}
