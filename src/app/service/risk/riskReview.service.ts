import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn : "root"
})
export class RiskReviewService {
  constructor(
    private http: HttpClient
  ) {
  };


  getList(paras: Object) {

    let para = ObjToQuery(paras);

    let url = GLOBAL.API.risk.riskList;
    return this.http.get(url, {
      params: para
    });
  };
  setAllocation(data : Object) {
    let url = GLOBAL.API.risk.setEmployees ;

    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;

    return this.http.put(url , data , {
      headers : header
    });
  }
  getriskReview(paras) {
    let url = GLOBAL.API.risk.riskReview.getriskReview;
    let para = ObjToQuery(paras) ;
    return this.http.get(url , {
      params : para
    });
  }
  getUserSocialIdentityCode(){
    let url = GLOBAL.API.risk.riskReview.getUserSocialIdentityCode;
    return this.http.get(url);
  }

  setriskReview(data: Object) {
    let header = new HttpHeaders()
      .set("Content-type", 'application/json');
    let url = GLOBAL.API.risk.riskReview.setriskReview;
    return this.http.put(url+"/"+data['id'], data, {
      headers: header
    });

  };
}
