import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn : "root"
})
export class channelDataService{
  constructor(
    private http : HttpClient
  ){};

  getData(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.channelData;
    return this.http.get(url, {
      params : para
    });
  };
  getDataH5(paras? : Object){
    let para = ObjToQuery(paras) ;
    let url = GLOBAL.API.reportCenter.channelDataH5 ;
    return this.http.get(url, {
      params : para
    });
  };
  exChannelBranch(data : Object,type:Number){
    let url;
    if(type===1){
      let str='';
      if(data["startDate"]){
        str+="&startDate=" + data["startDate"]
      }
      if(data["endDate"]){
        str+="&endDate="+data['endDate']
      }
      if(data["serialNumber"]){
        str+="&serialNumber="+data['serialNumber']
      }
      if(data["invitationCode"]){
        str+="&invitationCode="+data['invitationCode']
      }
      if(data["channelBranchName"]){
        str+="&channelBranchName="+data['channelBranchName']
      }
      url = GLOBAL.API.reportCenter.channelExport+"?isPaging=false"+str;
    }
    else if(type===2){
      let str='';
      if(data["startDate"]){
        str+="&startDate=" + data["startDate"]
      }
      if(data["endDate"]){
        str+="&endDate="+data['endDate']
      }
      if(data["id"]){
        str+="&id="+data['id']
      }
      if(data["name"]){
        str+="&name="+data['name']
      }
      url = GLOBAL.API.reportCenter.channelH5Export+"?isPaging=false"+str;
    }
    console.log(url);
    window.location.href = url;
    return ;
  }
}
