import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}
  // 登录信息
  getLoginInfo(usrId: number){
    const url = GLOBAL.API.order.user.loginInfo + "/" + usrId;

    return this.http.get(url);
  }
  //用户基本信息
  getBasicInfo(usrId: number) {
    const url = GLOBAL.API.order.user.basicInfo + "/" + usrId;

    return this.http.get(url);
  }
  //设备信息
  getDeviceInfo(usrId: number) {
    const url = GLOBAL.API.order.user.deviceInfo + "/" + usrId;

    return this.http.get(url);
  }
  //信用分
  getCreditScore(usrId: number) {
    const url = GLOBAL.API.order.user.creditScore + "/" + usrId;

    return this.http.get(url);
  }
  //电信分
  getTelecomScore(usrId: number) {
    const url = GLOBAL.API.order.user.telecomScore + "/" + usrId;
    return this.http.get(url);
  }
  //个人信息
  getPersonalInfo(usrId: number) {
    const url = GLOBAL.API.order.user.personalInfo + "/" + usrId;

    return this.http.get(url);
  }
  //雇佣信息
  getWorkInfo(usrId: number) {
    const url = GLOBAL.API.order.user.workInfo + "/" + usrId;
    return this.http.get(url);
  }
//身份验证信息
  identityrecognition(usrId: number) {
    const url = GLOBAL.API.order.user.identityrecognition + "/" + usrId;
    return this.http.get(url);
  }
  //活体校验
  livenessCompare(usrId: number) {
    const url = GLOBAL.API.order.user.livenessCompare + "/" + usrId;
    return this.http.get(url);
  }
  //风险识别
  riskIdentification(usrId: number) {
    const url = GLOBAL.API.order.user.riskIdentification + "/" + usrId;
    return this.http.get(url);
  }
  //多设备号
  getCreditDeviceInfo(usrId: number) {
    const url = GLOBAL.API.order.user.creditDeviceInfo + "/" + usrId;
    return this.http.get(url);
  }
  //紧急联系人
  getContactInfo(usrId: number) {
    const url = GLOBAL.API.order.user.contactInfo + "/" + usrId;
    return this.http.get(url);
  }
  //当前借款信息
  getloanInfo(usrId: number) {
    const url = GLOBAL.API.order.user.loanInfo + "/" + usrId;
    return this.http.get(url);
  }
  //审批记录
  getRecordInfo(usrId: number) {
    const url = GLOBAL.API.order.user.recordInfo + "/" + usrId;
    return this.http.get(url);
  }
  // 历史申请订单
  getApplyOrder(data: object) {
    const para = ObjToQuery(data);
    console.log(para);
    const url = GLOBAL.API.order.user.applyOrder;
    return this.http.get(url, {
      params: para
    });
  }
  //历史借还信息
  getBorrowInfo(usrId: number) {
    const url = GLOBAL.API.order.user.borrowInfo + "/" + usrId;
    return this.http.get(url);
  }
  //查询当前用户的运营商信息
  getTelecomType(usrId: number) {
    const url = GLOBAL.API.order.user.getTelecomType + "/" + usrId;
    return this.http.get(url);
  }
  //查询telkomsel运营商信息
  getTelkomselData(usrId: number) {
    const url = GLOBAL.API.order.user.getTelkomselData + "/" + usrId;
    return this.http.get(url);
  }
  //查询XL运营商信息
  getXLData(usrId: number) {
    const url = GLOBAL.API.order.user.getXLData + "/" + usrId;
    return this.http.get(url);
  }
  getIndosatData(usrId: number) {
    const url = GLOBAL.API.order.user.getIndosatData + "/" + usrId;
    return this.http.get(url);
  }




  getAuthenticationResult(usrId: number) {
    const url = GLOBAL.API.order.user.basicInfo + "/" + usrId;

    return this.http.get(url);
  }
  getLiveCalibration(usrId: number) {
    const url = GLOBAL.API.order.user.basicInfo + "/" + usrId;

    return this.http.get(url);
  }






  getAccountInfo(userId: number) {
    const url = GLOBAL.API.order.user.accountInfo + "/" + userId;

    return this.http.get(url);
  }

  getAuth(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.auth + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getOrderAuth(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.orderauth + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getOrderDetailinfo(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.orderdetailinfo + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getUserLoginInfo(usrId: number) {
    const url = GLOBAL.API.order.user.userInfo + "/" + usrId;

    return this.http.get(url);
  }

  getDetailinfo(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.detailinfo + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getFamilyInfo(usrId: number) {
    const url = GLOBAL.API.order.user.familyInfo + "/" + usrId;

    return this.http.get(url);
  }

  // getWorkInfo(usrId: number) {
  //   const url = GLOBAL.API.order.user.workInfo + "/" + usrId;
  //
  //   return this.http.get(url);
  // }

  getFriendInfo(usrId: number) {
    const url = GLOBAL.API.order.user.friendInfo + "/" + usrId;

    return this.http.get(url);
  }

  getBankInfo(userId: number) {
    const url = GLOBAL.API.order.user.bankInfo + "/" + userId;
    return this.http.get(url);
  }

  getOrderHisList(userId: number) {
    const url = GLOBAL.API.order.user.orderHisList + "/" + userId;
    return this.http.get(url);
  }

  getRecordList(userId: number) {
    const url = GLOBAL.API.order.user.recordDetail + "/" + userId;
    return this.http.get(url);
  }
}
