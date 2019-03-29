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
  templateUrl: './conversionfunnel.component.html',
  styleUrls: ['./conversionfunnel.component.less']
})
export class conversionfunnelComponent implements OnInit {

  constructor(
    private msg: CommonMsgService,
    private translateSer: TranslateService,
    private service : channelDataService ,
  ) {
  };

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  channelType:Array< String >;
  chType:number=1;
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  totalSize: number = 0;
  tableData: TableData;

  getLanguage() {
    this.translateSer.stream(['reportModule.channeldata', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['reportModule.channeldata']['table'],
          };
          this.channelType=data['reportModule.channeldata']['channelType'];
          console.log(this.channelType);
          // this.getList();
        }
      );
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
