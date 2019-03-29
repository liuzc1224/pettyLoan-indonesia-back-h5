import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../share/table/table.model';
import {CommonMsgService,MsgService} from '../../service/msg';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage';
import {ObjToArray} from '../../share/tool';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model';
import {HelpCenterService} from '../../service/msgCenter/helpCenter.service';
import {SearchModel} from "./searchModel";
import {DateObjToString} from '../../format';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./helpCenter.component.html" ,
  styleUrls : ['./helpCenter.component.less']
})
export class HelpCenterComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : HelpCenterService ,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  title:String="";
  searchModel : SearchModel = new SearchModel() ;
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":[null],
      "title" : [null , [Validators.required] ] ,
      "content" : [null , [Validators.required] ] ,
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["msgCenter.helpCenter","common","channel"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['msgCenter.helpCenter'],
          };
          // let channelStatus=data['channel']['channelStatus'];
          // this.channelStatus=Object.values(channelStatus);
          this.initialTable();
        }
      )
  };
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : true ,
      tableTitle : [
        {
          name : __this.languagePack['data']['table']['id'] ,
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['serialNumber'] ,
          reflect : "order" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['problem'] ,
          reflect : "title" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['answer'] ,
          reflect : "content" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['itWorks'] ,
          reflect : "usefulCount" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['useless'] ,
          reflect : "uselessCount" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['table']['founder'] ,
          reflect : "createPerson" ,
          type : "text"
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['edit'],
            bindFn : (item) => {

              this.validForm.patchValue({
                id:item.id,
                title:item.title,
                content : item.content
              });
              this.title=this.languagePack['data']['edit'];
              this.isVisible=true;
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['moveUp'],
            bindFn : (item) => {
              if(item['order']==1){
                return;
              }
              let data={
                id:item.id
              };
              this.service.moveUp(data)
                .pipe(
                  filter((res: Response) => {
                    if(res.success === false){
                      this.Cmsg.fetchFail(res.message) ;
                    }
                    return res.success === true;
                  })
                )
                .subscribe(
                  (res: Response) => {
                    this.Cmsg.operateSuccess();
                    this.getList();
                  }
                )
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['moveDown'],
            bindFn : (item) => {
              if(item['order']===this.tableData.data["length"]){
                return
              }
              let data={
                id:item.id
              };
              this.service.moveDown(data)
                .pipe(
                  filter((res: Response) => {
                    if(res.success === false){
                      this.Cmsg.fetchFail(res.message) ;
                    }
                    return res.success === true;
                  })
                )
                .subscribe(
                  (res: Response) => {
                    this.Cmsg.operateSuccess();
                    this.getList();
                  }
                )
            }
          },
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['operate']['delete'],
            bindFn : (item) => {
              this.isDelete=true;
              this.sgo.set('helpId', {
                id: item.id,
              });
            }
          }
        ]
      }
    };
    this.getList();
  }
  totalSize : number = 0 ;
  getList(){
    this.tableData.loading = true ;
    let data=this.searchModel;
    let etime = DateObjToString( (<Date>data.endDate) );
    data.startDate = DateObjToString( (<Date>data.startDate) ) ;
    data.endDate = etime && etime.indexOf(':') == -1 ? etime  + " 23:59:59" : etime;
    this.service.getHelpCenter(data)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }else{
            this.totalSize =0;
          }
          this.tableData.loading = false ;
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
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  add(){
    this.title=this.languagePack['data']['add'];
    this.validForm.reset();
    this.isVisible=true;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("helpId").id
    };
    this.service.deleteHelp(data)
      .pipe(
        filter( (res : Response) => {
          this.isDeleteLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isDelete=false;
          this.getList();
        }
      );
  }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    let postData = this.validForm.value ;
    if(postData["id"]){
      this.updateHelp(postData);
    }else{
      this.addHelp(postData);
    }
  }
  addHelp(data){
    let postData={
      content : data['content'],
      title : data['title']
    };
    this.service.addHelp(postData)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isVisible=false;
          this.getList();
        }
      );
  }
  updateHelp(data){
    this.service.updateHelp(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isVisible=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.validForm.reset();
    this.isVisible=false;
  }
}
