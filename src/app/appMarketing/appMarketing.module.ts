import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import {RecommendComponent} from './recommend/recommend.component';
import {PopUpsComponent} from './adPush/Pop-ups/Pop-ups.component';
import {SplashScreenComponent} from './adPush/splashScreen/splashScreen.component';
const routes  : Routes = [
  {
    path : "recommend" ,
    component : RecommendComponent ,
    data : {
      reuse : false ,
      title : "首页推荐"
    }
  },
  {
    path: "Pop-ups",
    component: PopUpsComponent,
    data: {
      reuse : false ,
      title : "弹窗广告"
    },
  },
  {
    path: "splashScreen",
    component: SplashScreenComponent,
    data: {
      reuse : false ,
      title : "闪屏广告"
    },
  }
];
const component = [
  RecommendComponent,
  PopUpsComponent,
  SplashScreenComponent
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
export class AppMarketingModule{ }
