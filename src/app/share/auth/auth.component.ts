import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../service/order";
import { filter } from "rxjs/operators";
import {CommonMsgService, MsgService} from '../../service/msg';
import { Response } from "../model";
import { TableData } from "../../share/table/table.model";
import { unixTime, reviewOrderStatustransform ,DateObjToString} from "../../format";
import {style} from '@angular/animations';

declare var $: any;
@Component({
  selector: "auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.less"]
})
export class AuthComponent {
  constructor(
    private translate: TranslateService,
    private usrSer: UserService,
    private Cmsg: CommonMsgService,
    private msg: MsgService
  ) {}

  userId: number;
  orderId: number;

  languagePack: Object;
  status:number=1;
  statusEnum :Array<Object>;
  detailinfo: Object;
  loginInfoData;
  basicInfoData;
  deviceInfoData;
  creditScore;
  telecomScore;
  personalInfoData;
  workInfoData;
  identityrecognition;
  livenessCompare;
  riskIdentification;
  creditDeviceInfoData;
  contactInfoData;
  loanInfoData;
  recordInfoData;
  applyOrderData: TableData;
  borrowInfoData : TableData;
  indosatData;
  telkomselData;
  XLData;
  yzjg="";

  getData(userId: number, orderId: number) {
    this.userId = userId;
    this.orderId = orderId;
    this.initData();
    // this.getDetailinfo();
    // this.getAuth();
  }
  getLanguage() {
    this.translate
      .stream([
        "financeModule.list",
        "common",
        "riskModule",
        "authModule",
        "orderList.allList.table",
        "reviewRiskList.tableModule"
      ])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          data: data["financeModule.list"],
          risk: data["riskModule"],
          orderList: data["orderList.allList.table"],
          recordList: data["reviewRiskList.tableModule"],
          authModule:data["authModule"],
          applyOrder: data["authModule"]["historyApplication"],
          borrowInfo: data["authModule"]["historyBorrow"]
        };
        this.statusEnum=data["authModule"]['statusEnum'];
        this.initApplyOrderData();
        this.initBorrowInfoData();
        // this.initialTable();
        // this.initialRecordTable();
      });
  }
  initData(){
    this.getLoginInfo();
    this.getBasicInfo();
    this.getDeviceInfo();
    this.getCreditScore();
    this.getTelecomScore();
    this.getPersonalInfo();
    this.getWorkInfo();
    this.getIdentityrecognition();
    this.getLivenessCompare();
    this.getRiskIdentification();
    this.getCreditDeviceInfo();
    this.getContactInfo();
    this.getloanInfo();
    this.getRecordInfo();
    this.getLanguage();
    this.getTelecomType();
    setTimeout(() => {
      $("[data-magnify=gallery]").magnify();
    }, 20);
  }
  getLoginInfo(){
    this.usrSer.getLoginInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.loginInfoData = (<Array<Object>>res.data);
            console.log(this.loginInfoData);
          }
        });
  }
  getBasicInfo(){
    this.usrSer.getBasicInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.basicInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getDeviceInfo(){
    this.usrSer.getDeviceInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.deviceInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getCreditScore(){
    this.usrSer.getCreditScore(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.creditScore = res.data;
          }
        });
  }
  getTelecomScore(){
    this.usrSer.getTelecomScore(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.telecomScore = res.data;
          }
        });
  }
  getPersonalInfo(){
    this.usrSer.getPersonalInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.personalInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getWorkInfo(){
    this.usrSer.getWorkInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.workInfoData = res.data;
          }
        });
  }
  getIdentityrecognition(){
    this.usrSer.identityrecognition(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.identityrecognition = res.data;
            let a=false;
            if(this.identityrecognition['wrongType']===0 || this.identityrecognition['wrongType']===4 || this.identityrecognition['wrongType']===5 || this.identityrecognition['wrongType']===6){
              a=true;
            }
            this.yzjg=a && this.identityrecognition['isMatch']===1 ? "<span style='color:red'>"+this.languagePack['authModule']['authenticationResult']['true'] : this.languagePack['authModule']['authenticationResult']['false'];
          }
        });
  }
  getLivenessCompare(){
    this.usrSer.livenessCompare(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.livenessCompare = res.data;
          }
        });
  }
  getRiskIdentification(){
    this.usrSer.riskIdentification(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.riskIdentification = res.data;
          }
        });
  }
  getCreditDeviceInfo(){
    this.usrSer.getCreditDeviceInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.creditDeviceInfoData = res.data;
          }
        });
  }
  getContactInfo(){
    this.usrSer.getContactInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.contactInfoData = res.data;
          }
        });
  }
  getloanInfo(){
    this.usrSer.getloanInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){

            this.loanInfoData = res.data;
            console.log(this.loanInfoData);
          }
        });
  }
  getRecordInfo(){
    this.usrSer.getRecordInfo(this.orderId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.recordInfoData = res.data;
          }
        });
  }
  getApplyOrder(){
    let userIds=[];
    userIds.push(this.userId);
    let data={
      userIds : userIds
    };
    this.usrSer.getApplyOrder(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.applyOrderData.data = (< Array<Object> >res.data);
          }
        });
  }
  getBorrowInfo(){
    this.usrSer.getBorrowInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.borrowInfoData.data =(< Array<Object> >res.data);
          }
        });
  }
  getTelecomType(){
    this.usrSer.getTelecomType(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            let data =(res.data);
            if(!data){
              this.telkomselData=[];
              this.indosatData=[];
              this.XLData=[];
            }
            if(data==1){
              this.getTelkomselData();
            }
            if(data==2){
              this.getXLData();
            }
            if(data==3){
              this.getIndosatData();
            }
          }
        });
  }
  getIndosatData(){
    this.usrSer.getIndosatData(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.indosatData = res.data;
          }
        });
  }
  getTelkomselData(){
    this.usrSer.getTelkomselData(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.telkomselData = res.data;
          }
        });
  }
  getXLData(){
    this.usrSer.getXLData(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.XLData = res.data;
          }
        });
  }
  initApplyOrderData(){
    let __this=this;
    this.applyOrderData = {
      tableTitle: [
        {
          name: __this.languagePack["applyOrder"]["creditOrderNo"],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: __this.languagePack["applyOrder"]["applyDate"],
          reflect: "applyDate",
          type: "text",
          filter:(item)=>{
            return item['applyDate'] ? unixTime(item['applyDate']) : "";
          }
        },
        {
          name: __this.languagePack["applyOrder"]["userPhone"],
          reflect: "userPhone",
          type: "text"
        },
        {
          name: __this.languagePack["applyOrder"]["userGrade"],
          reflect: "userGrade",
          type: "text"
        },
        {
          name: __this.languagePack["applyOrder"]["auditLimit1"],
          reflect: "productVOList",
          type: "text",
          filter: item => {
            const productVOList=item["productVOList"];
            if(productVOList.length>0){
              let list=productVOList.filter(v=>{
                return v['loanProductType']===1
              });
              return (list && list[0] &&  list[0]['approveAmountMin'] && list[0]['approveAmountMax']) ? list[0]['approveAmountMin']+"-"+ list[0]['approveAmountMax'] : ""
            }
          }
        },
        {
          name: __this.languagePack["applyOrder"]["auditTerm1"],
          reflect: "productVOList",
          type: "text",
          filter: item => {
            const productVOList=item["productVOList"];
            if(productVOList.length>0){
              let list=productVOList.filter(v=>{
                return v['loanProductType']===1
              });
              return (list && list[0] &&  list[0]['loanTermMix'] && list[0]['loanTermMax']) ? list[0]['loanTermMix']+"-"+ list[0]['loanTermMax'] : ""
            }
          }
        },
        {
          name: __this.languagePack["applyOrder"]["auditLimit2"],
          reflect: "productVOList",
          type: "text",
          filter: item => {
            const productVOList=item["productVOList"];
            if(productVOList.length>0){
              let list=productVOList.filter(v=>{
                return v['loanProductType']===2
              });
              return (list && list[0] &&  list[0]['approveAmountMin'] && list[0]['approveAmountMax']) ? list[0]['approveAmountMin']+"-"+ list[0]['approveAmountMax'] : ""
            }
          }
        },
        {
          name: __this.languagePack["applyOrder"]["auditTerm2"],
          reflect: "productVOList",
          type: "text",
          filter: item => {
            const productVOList=item["productVOList"];
            if(productVOList.length>0){
              let list=productVOList.filter(v=>{
                return v['loanProductType']===2
              });
              return (list && list[0] &&  list[0]['loanTermMix'] && list[0]['loanTermMax']) ? list[0]['loanTermMix']+"-"+ list[0]['loanTermMax'] : ""
            }
          }
        },
        {
          name: __this.languagePack["applyOrder"]["approveDays"],
          reflect: "approveDays",
          type: "text"
        },
        {
          name: __this.languagePack["applyOrder"]["approveEffectDay"],
          reflect: "approveEffectDay",
          type: "text",
          filter:(item)=>{
            return item['applyDate'] ? unixTime(item['applyDate']) : "";
          }
        },
        {
          name: __this.languagePack["applyOrder"]["approveExpDay"],
          reflect: "approveExpDay",
          type: "text",
          filter:(item)=>{
            return item['applyDate'] ? unixTime(item['applyDate']) : "";
          }
        },
        {
          name: __this.languagePack["applyOrder"]["adminName"],
          reflect: "adminName",
          type: "text"
        },
        {
          name: __this.languagePack["applyOrder"]["creditIdea"],
          reflect: "creditIdea",
          type: "text",
          filter: item => {
            const creditIdea = item["creditIdea"];
            const creditIdeaRemark = item["creditIdeaRemark"];
            if (creditIdea == 7) {
              return creditIdeaRemark;
            } else {
              return creditIdea;
            }
          }
        },
        {
          name: __this.languagePack["applyOrder"]["auditOrderStatus"],
          reflect: "status",
          type: "mark",
          markColor: {
            "1": "#ec971f",
            "2": "#108ee9",
            "9": "#d9534f",
            "12": "#d9534f"
          },
          filter: item => {
            const status = item["status"];
            let name = reviewOrderStatustransform(status);
            return name;
          }
        }
      ],
      loading: false,
      showIndex: true
    };
    this.getApplyOrder();
  }
  initBorrowInfoData(){
    let __this=this;
    this.borrowInfoData = {
      tableTitle: [
        {
          name: __this.languagePack["borrowInfo"]["creditOrderNo"],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["orderNo"],
          reflect: "orderNo",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["orderType"],
          reflect: "orderType",
          type: "text",
          filter:(item)=>{
            let orderType=__this.languagePack["authModule"]["orderType"];
            let name=orderType.filter(v=>{
              return v['value']===item["orderType"]
            });
            return (name && name[0] && name[0]["desc"]) ? name[0]["desc"] : "";
          }
        },
        {
          name: __this.languagePack["borrowInfo"]["createTime"],
          reflect: "createTime",
          type: "text",
          filter:(item)=>{
            return item['createTime'] ? unixTime(item['createTime']) : "";
          }
        },
        {
          name: __this.languagePack["borrowInfo"]["applyMoney"],
          reflect: "applyMoney",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["limit"],
          reflect: "loanDays",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["period"],
          reflect: "applyMonth",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["otherFee"],
          reflect: "monthAuditCharge",
          type: "text",
          filter:(item)=>{
            let monthAuditCharge=item['monthAuditCharge'];
            let monthTechnologyCharge=item["monthTechnologyCharge"];
            let money=monthAuditCharge+monthTechnologyCharge;
            return money ? money : "";
          }
        },
        {
          name: __this.languagePack["borrowInfo"]["lendRateMoney"],
          reflect: "lendRateMoney",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["overDueRateMoney"],
          reflect: "overDueRateMoney",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["currentRepay"],
          reflect: "realRepayMoney",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["planRepaymentDate"],
          reflect: "planRepaymentDate",
          type: "text",
          filter:(item)=>{
            return item['planRepaymentDate'] ? unixTime(item['planRepaymentDate']) : "";
          }
        },
        {
          name: __this.languagePack["borrowInfo"]["adminName"],
          reflect: "adminName",
          type: "text"
        },
        {
          name: __this.languagePack["borrowInfo"]["creditIdea"],
          reflect: "creditIdea",
          type: "text",
          filter: item => {
            const creditIdea = item["creditIdea"];
            const creditIdeaRemark = item["creditIdeaRemark"];
            if (creditIdea == 7) {
              return creditIdeaRemark;
            } else {
              return creditIdea;
            }
          }
        },
        {
          name: __this.languagePack["borrowInfo"]["auditOrderStatus"],
          reflect: "status",
          type: "mark",
          filter: item => {
            const status = item["status"];
            let name = reviewOrderStatustransform(status);
            return name;
          }
        }
      ],
      loading: false,
      showIndex: true
    };
    this.getBorrowInfo();
  }
  changeStatus(data){
    this.status=data;
  }





  photoInfo: Object;

  isShowCall: boolean = false;
  isBigImg: boolean = false;
  classe: string; //用户等级，spc查询，默认为F
  getDetailinfo() {
    let userId = this.userId;
    let serType = this.orderId ? "getOrderDetailinfo" : "getDetailinfo";
    let data = {
      orderId: this.orderId
    };
    this.usrSer[serType](userId, data).subscribe((res: Response) => {
      if (res.success) {
        this.detailinfo = res.data;
        this.classe = res.data["spcScoreVO"].length
          ? res.data["spcScoreVO"][0]["classe"]
          : null;
        console.log(this.detailinfo);
      } else {
        this.Cmsg.fetchFail(res.message);
      }
    });
  }

  getAuth() {
    let serType = this.orderId ? "getOrderAuth" : "getAuth";
    let data = {
      orderId: this.orderId
    };

    this.usrSer[serType](this.userId, data).subscribe((res: Response) => {
      this.photoInfo = res.data;
    });
  }

  showCallList() {
    let flag = this.friendInfo.callList.length ? true : false;
    this.isShowCall = flag;
  }

  hideMask() {
    this.isShowCall = false;
  }
  //人际关系
  friendInfo = {
    title: "Relación",
    trChild: [],
    callList: []
  };

  showImg(index) {
    $("[data-magnify=gallery]")[index].click();
  }

  dateToString(data){
    if(data){
      return DateObjToString(new Date(data));
    }else {
      return;
    }
  }
  toString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }
}
