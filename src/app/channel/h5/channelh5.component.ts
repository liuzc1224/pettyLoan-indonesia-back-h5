import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../share/table/table.model';
import { unixTime} from '../../format/index';
import {CommonMsgService, MsgService} from '../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage/index';
import {ObjToArray} from '../../share/tool/index';
import {filter} from 'rxjs/operators';
import {SearchModel} from "./searchModel";
import {Response} from '../../share/model/index';
import {ChannelH5Service} from '../../service/channel/index';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./channelh5.component.html" ,
  styleUrls : ['./channelh5.component.less']
})
export class Channelh5Component implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router : Router ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ChannelH5Service ,

  ){} ;
  searchModel : SearchModel = new SearchModel() ;
  languagePack : Object ;
  tableData : TableData ;
  validForm : FormGroup;
  isVisible:Boolean=false;
  isOkLoading:Boolean=false;
  channelStatus:Array< String >;
  unit:Array< Object >;
  method:Array<Object>;
  title:String="";
  template : Array<String>=[
    "https://hujin2-s1.s3-sa-east-1.amazonaws.com/g3-test%5C53635c7433f4438dbd68feeaf4bb43f5?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190313T082321Z&X-Amz-SignedHeaders=host&X-Amz-Expires=432000&X-Amz-Credential=AKIAJL4XYZBGGLWMQLCA%2F20190313%2Fsa-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8f162d8186c88298af65ef2cd0a4cee6b6964fede7b799271628903ec0f09e74",
    "https://hujin2-s1.s3-sa-east-1.amazonaws.com/g3-test%5C96587fb9cba44ac8b4128818a4ad164d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190313T082508Z&X-Amz-SignedHeaders=host&X-Amz-Expires=431999&X-Amz-Credential=AKIAJL4XYZBGGLWMQLCA%2F20190313%2Fsa-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e6b8cfda4177ff1dbd1701050411f8e47e40cc3e24ada2bb4a0d91680b711178"
  ];
  private searchCondition: Object = {};
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":null,
      "name" : [null , [Validators.required] ] ,
      "logo" : [null , [Validators.required] ] ,
      "link" : [null , [Validators.required] ] ,
      "clearingWay" : [null , [Validators.required] ] ,
      "everyAmount" : [ null ] ,
      "everyAmountUnit" : [ null ] ,
      "state" : [ 1 , [Validators.required] ] ,
      "Url":[ null ,[Validators.required]]
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["channel","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            list:data['channel']['tabData'],
            data:data["channel"]
          };
          this.channelStatus=data['channel']['channelStatus'];
          this.unit=data['channel']['unit'];
          this.method=data['channel']['method'];

          this.initialTable() ;
        }
      )
  };
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : false ,
      tableTitle : [
        {
          name : __this.languagePack['list']['channelId'],
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['name'] ,
          reflect : "name" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['type'] ,
          reflect : "link" ,
          type : "text",
          filter:(item)=>{
            return "H5";
          }
        },
        {
          name : __this.languagePack['list']['shareLink'] ,
          reflect : "link" ,
          type : "text",
        },
        {
          name : __this.languagePack['list']['QRCode'] ,
          reflect : "link" ,
          type : "text",
        },
        {
          name : __this.languagePack['list']['method'] ,
          reflect : "clearingWay" ,
          type : "text",
        },
        {
          name : __this.languagePack['list']['everyAmount'] ,
          reflect : "everyAmount" ,
          type : "text",
          filter:(item)=>{
            let everyAmount=item['everyAmount'] ? item['everyAmount'] : "";
            let unit=this.unit.filter(v=>{
              return v['value']===item['everyAmountUnit']
            });
            let everyAmountUnit= unit && unit[0] && unit[0]['desc'] ? unit[0]['desc'] : "";
            return everyAmount + everyAmountUnit;
          }
        },
        {
          name : __this.languagePack['list']['channelStatus'] ,
          reflect : "state" ,
          type : "text",
          filter : ( item ) => {
            const status = item['state'] ;
            let name=this.channelStatus.filter(v=>{
              return v['value']===status;
            });
            return (name && name[0] && name[0]['desc']) ? name[0]['desc'] : "" ;
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [{
          textColor : "#0000ff",
          name : __this.languagePack['common']['operate']['name'],
          bindFn : (item) => {
            this.isVisible=true;
            this.title=this.languagePack['data']['btn']['edit'];
            this.validForm.patchValue({
              "id": item.id,
              "name":item.name,
              "link":item.link,
              "state":item.state,
              "logo" : item.logo ,
              "clearingWay" : item.clearingWay ,
              "everyAmount" : item.everyAmount ,
              "everyAmountUnit" : item.everyAmountUnit ,
              "Url" : item.templateUrl
            });
          }
        }]
      }
    };
    this.getList() ;
  }
  totalSize : number = 0 ;
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  getList(){
    this.tableData.loading = true ;
    let data=this.searchModel;

    this.searchCondition['state']=true;
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;

    this.service.getChannelH5(data)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;

          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          this.tableData.data = (< Array<Object> >res.data);
          console.log(this.tableData.data);
          this.totalSize = res.page.totalNumber ;
        }
      );
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }

    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  handleCancel(){
    this.validForm.reset();
    this.isVisible = false;
  }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    let value=this.validForm.value;
    let postData = {
      "id": value.id,
      "name":value.name,
      "link":value.link,
      "state":value.state,
      "logo" : value.logo ,
      "clearingWay" : value.clearingWay ,
      "everyAmount" : value.everyAmount ,
      "everyAmountUnit" : value.everyAmountUnit ,
    };
    postData["templateUrl"]=this.validForm.value["Url"];
    if(postData["id"]){
      this.update(postData);
    }else{
      this.addChannelH5(postData);
    }
  }
  addChannelH5(data){

    this.service.addChannelH5(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isOkLoading = false;
          this.isVisible = false;
          this.getList();
          console.log(res.data);
        }
      );
  }
  update(data){
    data["templateUrl"]=this.validForm.value["Url"];
    this.service.update(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.isOkLoading = false;
          this.isVisible = false;
          this.getList();
          console.log(res.data);
        }
      );
  }
  add(){
    this.isVisible=true;
    this.title=this.languagePack['data']['btn']['add'];
    this.validForm.reset();
    this.validForm.patchValue({
      state:1,
      everyAmountUnit:'IDR',
      clearingWay:'NONE'
    });
  }
  num(){
    let val=this.validForm.get('everyAmount').value;
    if(val){
      this.validForm.patchValue({
        "everyAmount":val.replace(/[^0-9]/g,'')
      })
    }
  }
}
