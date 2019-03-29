import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class MsgPushService {
  constructor(private http: HttpClient) {}

  getMsgPush(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.msgCenter.msgPush.getMsgPush;
    return this.http.get(url, {
      params: para
    });
  }
  addMsgPush(data: Object) {
    let url = GLOBAL.API.msgCenter.msgPush.addMsgPush;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }
  updateMsgPush(data: Object) {
    let url = GLOBAL.API.msgCenter.msgPush.updateMsgPush;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  deleteMsgPush(data: Object) {
    let url = GLOBAL.API.msgCenter.msgPush.deleteMsgPush;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.get(url + "/" + data["id"]);
  }
}
