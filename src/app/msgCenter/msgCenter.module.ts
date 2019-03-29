import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { RouterModule, Router, Routes } from '@angular/router';
import { FeedBackComponent } from './feedBack/feedBack.component';
import { HelpCenterComponent } from './helpCenter/helpCenter.component';
import { MsgPushComponent } from './msgPush/msgPush.component';
import { RepaymentComponent } from './repayment/repayment.component'
const routes: Routes = [
  {
    path: "feedBack",
    component: FeedBackComponent,
    data: {
      reuse: false,
      title: "意见反馈"
    }
  }, {
    path: "helpCenter",
    component: HelpCenterComponent,
    data: {
      reuse: true,
      title: "帮助中心"
    }
  }, {
    path: "msgPush",
    component: MsgPushComponent,
    data: {
      reuse: true,
      title: "消息推送"
    }
  }
  , {
    path: "repayment",
    component: RepaymentComponent,
    data: {
      reuse: true,
      title: "消息推送"
    }
  }
];

const component = [
  FeedBackComponent,
  HelpCenterComponent,
  MsgPushComponent,
  RepaymentComponent
];

@NgModule({
  declarations: [
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
export class MsgCenterModule { }
