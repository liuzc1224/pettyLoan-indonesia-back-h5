import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { LoanListComponent } from './loanList/loanList.component' ;
import { RepayComponent } from './repay/repay.component' ;
import { AbnormalComponent } from './abnormal/abnormal.component' ;
const routes  : Routes = [
  {
      path : "loanList" ,
      component : LoanListComponent ,
      data : {
          reuse : true ,
          title : "Administración de prestar"
      }
  },
  {
		path : "repayList" ,
		component : RepayComponent ,
		data : {
			reuse : true ,
			title : "Administración de pagar"
		}
	},
  {
    path : "abnormal" ,
    component : AbnormalComponent ,
    data : {
      reuse : true ,
      title : "abnormal"
    }
  }
];

const component = [
	LoanListComponent ,
	RepayComponent,
  AbnormalComponent
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
export class FinanceModule{ }
