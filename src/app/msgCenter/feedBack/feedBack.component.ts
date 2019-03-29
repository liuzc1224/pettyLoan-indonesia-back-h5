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
import {ChannelBranchService} from '../../service/channel';
import {SearchModel} from "./searchModel";
import {FeedBackService} from '../../service/msgCenter';
import {DateObjToString, unixTime} from '../../format';
let __this ;
let __id;
declare var $: any;
@Component({
  selector : "" ,
  templateUrl : "./feedBack.component.html" ,
  styleUrls : ['./feedBack.component.less']
})
export class FeedBackComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private msg : MsgService ,
    private Cmsg : CommonMsgService ,
    private router : Router ,
    private routerInfo: ActivatedRoute ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : FeedBackService ,

  ){} ;
  validForm : FormGroup;
  languagePack : Object ;
  tableData : TableData ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  title:String="";
  feedBackInfo : Array<any>=[];
  searchModel : SearchModel = new SearchModel() ;
  isShowCall: boolean = false;
  isBigImg: boolean = false;
  ngOnInit(){
    __this = this ;
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["msgCenter.feedBack","common",])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data:data['msgCenter.feedBack'],
          };
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
          name : __this.languagePack['data']['feedbackDate'] ,
          reflect : "createTime" ,
          type : "text",
          filter: (item)=>{
            return item['createTime'] ? unixTime(item['createTime']) : "";
          }
        },
        {
          name : __this.languagePack['data']['userAccount'] ,
          reflect : "phoneNumber" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['feedbackTopic'] ,
          reflect : "title" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['feedbackContent'] ,
          reflect : "content" ,
          type : "text"
        },
        {
          name : __this.languagePack['data']['whetherSolve'] ,
          reflect : "solve" ,
          type : "text",
          filter: (item)=>{
            let solve=this.languagePack['data']['solve'];
            let name=solve.filter(v=>{
              return v['value']===item['solve'];
            });
            return (name && name[0] && name[0]['desc']) ? name[0]['desc'] : "";
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [
          {
            textColor : "#0000ff",
            name : __this.languagePack['common']['clickShow'],
            bindFn : (item) => {
              this.getInfo(item['id']);
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
    this.service.getFeedBack(data)
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

  showImg(index) {
    $("[data-magnify=gallery]")[index].click();
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
  hideMask() {
    this.isShowCall = false;
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
  getInfo(data){
    let obj={
      id:data
    };
    this.service.getFeedBackInfo(obj)
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
          this.feedBackInfo = (< Array<Object> >res.data);
          setTimeout(() => {
            $("[data-magnify=gallery]").magnify();
          }, 20);
          this.isVisible=true;
        }
      );
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("helpId").id
    };
    this.service.getFeedBack(data)
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
    // if(postData["id"]){
    //   this.updateHelp(postData);
    // }else{
    //   this.addHelp(postData);
    // }
  }
  handleCancel(){
    this.isVisible=false;
  }
  dateToString(data){
    if(data){
      return unixTime(data);
    }
  }
  userInfo(){
    this.router.navigate(['/usr/detail'] , {
      queryParams : {
        from : "feedBack" ,
        usrId : this.feedBackInfo['id']
      }
    });
  }
}
