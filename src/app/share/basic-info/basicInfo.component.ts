import { Component , OnInit , Input, Output } from '@angular/core';
import { UserService } from '../../service/order' ;
import { filter } from 'rxjs/operators';
import { CommonMsgService } from '../../service/msg'
import { Response } from '../model';
import { Router } from '@angular/router'
@Component({
    selector :"basic-info" ,
    templateUrl : "./basicInfo.component.html" ,
    styleUrls : ["./basicInfo.component.less"]
})
export class BasicInfoComponent implements OnInit{
    constructor(
        private usrSer : UserService ,
        private msg : CommonMsgService ,
        private router : Router
    ){};

    ngOnInit(){
    };
    usrId : number ;
    userInfo : Object ;
    getData(usrId : number){
        this.usrId = usrId ;
        this.usrSer.getPersonalInfo(usrId)
            .pipe(
                filter( (res : Response) => {
                    console.log(res);
                    if(res.success === false){
                        this.msg.fetchFail(res.message) ;
                    }
                    return res.success === true ;
                })
            )
            .subscribe(
                (res : Response ) => {
                  console.log(res.data);
                    this.userInfo = res.data ;
                }
            )
    };


    goToAuth(){

        let usrId = this.usrId ;

        this.router.navigate(['/usr/authDetail'] , {
            queryParams : {
                from : "usr" ,
                usrId :usrId
            }
        });
    };
};
