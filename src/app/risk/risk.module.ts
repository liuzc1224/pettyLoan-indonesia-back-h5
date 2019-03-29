import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { riskListComponent } from './riskList/riskList.component';
import { riskTotleListComponent } from './riskTotleList/riskTotleList.component';
import { riskShureListComponent } from './riskShureList/riskShureList.component';
import { riskSettingComponent } from './riskSetting/riskSetting.component';
import { deskAdminComponent } from './DeskAdmin/desk.component';
import { riskReportComponent } from './riskReportList/riskReport.component';
import { riskOperaCommon } from './riskOperaCommon/riskOperaCommon.component';
import { riskAttendanceComponent } from './riskAttendance/riskAttendance.component';
import { riskReviewComponent } from './riskReview/riskReview.component';
const routes  : Routes = [
    {
        path : "list" ,
        component : riskListComponent ,
        data : {
            reuse : true ,
            title : "风控列表"
        }
    },{
        path : "totle" ,
        component : riskTotleListComponent ,
        data : {
            reuse : true ,
            title : "审核总览"
        }
    },{
        path : "shure" ,
        component : riskShureListComponent ,
        data : {
            reuse : true ,
            title : "信审管理"
        }
    },{
        path : "riskSetting" ,
        component : riskSettingComponent ,
        data : {
            reuse : false ,
            title : "用户认证业务参数配置"
        }
    },{
      path : "riskReview" ,
      component : riskReviewComponent ,
      data : {
        reuse : false ,
        title : "机审业务参数配置"
      }
    },{
        path : "deskAdmin" ,
        component : deskAdminComponent ,
        data : {
            reuse : false ,
            title : "信审工作台（管理员）"
        }
    },{
        path : "report" ,
        component : riskReportComponent ,
        data : {
            reuse : true ,
            title : "信审报表"
        }
    },{
        path : "operPlatCommon" ,
        component : riskOperaCommon ,
        data : {
            reuse : true ,
            title : "信审工作台(专员)"
        }
    },{
        path : "riskAttendance" ,
        component : riskAttendanceComponent ,
        data : {
            reuse : true ,
            title : "考勤"
        }
    }
];

const component = [
	riskListComponent ,
	riskTotleListComponent,
	riskShureListComponent,
    riskSettingComponent,
    deskAdminComponent,
    riskReportComponent,
    riskOperaCommon,
    riskAttendanceComponent,
    riskReviewComponent
];

@NgModule({
	declarations : [
		...component
	],
	imports: [
		ShareModule,
		NgZorroAntdModule,
		RouterModule.forChild(routes)
	],
	providers: [],
	bootstrap: []
})
export class RiskModule{ };
