
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { RouterModule, Router, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component'
import { BoletoComponent } from './boleto/boleto.component'
const routes: Routes = [
	{
		path: "detail",
		component: DetailComponent,
		data: {
			reuse: false,
			title: "详情"
		}
	}, {
		path: "list",
		component: ListComponent,
		data: {
			reuse: true,
			title: "列表"
		}
	}, {
    path: "boleto",
    component: BoletoComponent,
    data: {
      reuse: true,
      title: "Boleto管理"
    }
  }
];

const component = [
	DetailComponent,
	ListComponent,
  BoletoComponent
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
export class OrderModule { };
