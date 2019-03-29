import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { channeldataComponent } from './channeldata/channeldata.component';
import { salesdataComponent } from './salesdata/salesdata.component';
import { conversionfunnelComponent } from './conversionfunnel/conversionfunnel.component';
import { financialdataComponent } from './financialdata/financialdata.component';
const routes  : Routes = [
  {
      path : "channeldata" ,
      component : channeldataComponent ,
      data : {
          reuse : false ,
          title : "渠道数据监测"
      }
  },
  {
    path : "salesdata" ,
    component : salesdataComponent ,
    data : {
      reuse : false ,
      title : "销售数据"
    }
  },
  {
    path : "conversionfunnel" ,
    component : conversionfunnelComponent ,
    data : {
      reuse : false ,
      title : "用户转化漏斗"
    }
  },
  {
    path : "financialdata" ,
    component : financialdataComponent ,
    data : {
      reuse : false ,
      title : "财务数据"
    }
  }
];

const component = [
  channeldataComponent ,
  salesdataComponent,
  conversionfunnelComponent,
  financialdataComponent
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
export class ReportCenterModule{ }
