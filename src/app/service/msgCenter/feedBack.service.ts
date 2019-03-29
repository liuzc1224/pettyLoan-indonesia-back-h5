import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class FeedBackService {
  constructor(private http: HttpClient) {}

  getFeedBack(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.msgCenter.feedBack.getFeedBack;
    return this.http.get(url, {
      params: para
    });
  }
  getFeedBackInfo(data: Object) {
    let url = GLOBAL.API.msgCenter.feedBack.getFeedBackInfo;
    return this.http.get(url + "/" + data["id"]);
  }
}
