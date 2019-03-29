import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class HelpCenterService {
  constructor(private http: HttpClient) {}

  getHelpCenter(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.msgCenter.helpCenter.getHelp;
    return this.http.get(url, {
      params: para
    });
  }
  addHelp(data: Object) {
    let url = GLOBAL.API.msgCenter.helpCenter.addHelp;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  updateHelp(data: Object) {
    let url = GLOBAL.API.msgCenter.helpCenter.updateHelp;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }

  deleteHelp(data: Object) {
    let url = GLOBAL.API.msgCenter.helpCenter.deleteHelp;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
  moveUp(data: Object){
    let url = GLOBAL.API.msgCenter.helpCenter.moveUp;
    return this.http.patch(url+"/"+data['id'],data);
  }
  moveDown(data: Object){
    let url = GLOBAL.API.msgCenter.helpCenter.moveDown;
    return this.http.patch(url+"/"+data['id'],data);
  }
}
