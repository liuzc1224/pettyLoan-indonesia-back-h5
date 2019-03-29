import {Component, OnInit} from '@angular/core';
import {SearchModel} from './searchModel';
import {TranslateService} from '@ngx-translate/core';
import {TableData} from '../../share/table/table.model';
import {RepayListService} from '../../service/fincial';
import {Response} from '../../share/model';
import {CommonMsgService, MsgService} from '../../service/msg';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { DateObjToString, unixTime} from '../../format';
import {filter} from 'rxjs/operators';
import {OrderService} from '../../service/order';
import {forkJoin} from 'rxjs';
let __this;
@Component({
  selector: 'app-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.less']
})
export class RepayComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private service: RepayListService,
    private msg: CommonMsgService,
    private Cmsg : MsgService ,
    private fb: FormBuilder,
    private router: Router,
    private orderSer: OrderService,
    private order: OrderService
  ) {
  };
  searchModel: SearchModel = new SearchModel();

  private searchCondition: Object = {};
  inputData:Array<Object>;
  serchEnum: Array<Object>;
  languagePack: object;
  operType:Array<Object>;
  hasClearForm: FormGroup;
  selectModel:String="creditOrderNo";
  inputContent:String="";
  statusEnum: Array<Object>;
  maxValue:Number=0;
  status: string;
  reapyEnum: Array<{ name: string, value: number }>;
  CxSerialNumber : Array<Object>;

  tableData: TableData;

  totalSize: number = 0;
  remark: Object;
  readonly :String="readonly";

  ngOnInit() {
    __this = this;
    this.getLanguage();

    this.hasClearForm = this.fb.group({
      'currentRepay': [null, [Validators.required]],//当月应还
      'description': [null],//说明
      'isCancelRepayment': [null],//撤销还款
      'isDone': [null, [Validators.required]],//是否结清
      'orderId': [null, [Validators.required]],//订单ID
      'repayMoney': [null, [Validators.required]],//还款金额
      'repayType': [null, [Validators.required]],//还款方式
      'repaymentDate': [null],//还款时间
      'serialNumber' : [null],//流水号
      'loanType':[null],//订单类型
      'money' : [null],//撤销还款金额
      'repaymentPlanId': [null, [Validators.required]],//还款记录ID
      'manualRepaymentId':[null],
      'realRepayMoney': [null],
      'userId': [null],//用户ID
      'currentPeriod':[null],//当前期数
      'totalPeriod':[null],//总期数
      'operator':1,//
      'operationResult':0
    });

  };

  getLanguage() {
    this.translate.stream(['common', 'financeModule.repayList','financeModule.serach1'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            repayList: res['financeModule.repayList'],
            serach:res['financeModule.serach1']
          };

          this.getEnum(this.languagePack['repayList']['status1']);
          this.reapyEnum = this.languagePack['repayList']['repayType'];
          this.serchEnum=this.languagePack['serach'];
          this.inputData=this.languagePack['repayList']['type'];
          this.initTable();
        }
      );
  };
  getEnum(data: Array<Object>) {
    this.statusEnum = data;
  };

  initTable() {
    this.tableData = {
      showIndex: true,
      loading: false,
      tableTitle: [
        {
          name: this.languagePack['repayList']['tabData']['letterReview'],
          reflect: 'creditOrderNo',
          type: 'text'
        },
        {
          name: this.languagePack['repayList']['tabData']['orderNo'],
          reflect: 'orderNo',
          type: 'text'
        },
        {
          name: this.languagePack['repayList']['tabData']['type'],
          reflect: 'loanType',
          type: 'text',
          filter:(item) =>{
            let loanType=item['loanType'];
            if(item['loanType']){
              let type=__this.inputData.filter(v => {
                return v.value===item['loanType']
              });
              loanType=(type && type[0].desc) ? type[0].desc : "";
            }
            return (loanType) ? loanType : "";
          }
        },
        {
          name: this.languagePack['repayList']['tabData']['mobile'],
          reflect: 'userPhone',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['userName'],
          reflect: 'userName',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['periodsNumber'],
          reflect: 'totalPeriod',
          type: 'text',
          filter: (item) => {
            const currentPeriod = item['currentPeriod'];
            const totalPeriod=item['totalPeriod'];
            return (currentPeriod && totalPeriod) ? currentPeriod+" / "+totalPeriod : "";
          }
        },
        {
          name: this.languagePack['repayList']['tabData']['periodRepayShould'],
          reflect: 'currentRepay',
          type: 'text',
          filter: (item) => {
            let currentRepay = item['currentRepay']+item['overDueFine'];
            if(item['loanType']===1){
              currentRepay=currentRepay+item['otherCost']
            }
            return (currentRepay ) ? (currentRepay).toFixed(2): "";
          }
        }, {
          name: this.languagePack['repayList']['tabData']['financingAmount'],
          reflect: 'payMoney',
          type: 'text',
          filter: (item) => {
            let financingMoney = item['payMoney'];
            if(item['loanType']===2){
              financingMoney=financingMoney-item['otherCost']
            }
            return (financingMoney) ? (financingMoney).toFixed(2): "";
          }
        },{
          name: this.languagePack['repayList']['tabData']['interest'],
          reflect: 'lendRateMoney',
          type: 'text',
        },{
          name: this.languagePack['repayList']['tabData']['overdueFee'],
          reflect: 'overDueFine',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['RepayTimeShould'],
          reflect: 'stringPlanRepaymentDate',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['repayMount'],
          reflect: 'realRepayMoney',
          type: 'text',
        },{
          name: this.languagePack['repayList']['tabData']['repayDate'],
          reflect: 'recentRepaymentDate',
          type: 'text',
          filter: (item) => {
            let name=null;
            if(item['stringRecentRepaymentDate']){
              name=item['stringRecentRepaymentDate'];
              return (name) ? name : null;
            }else{
              return null;
            }
          }
        }, {
          name: this.languagePack['repayList']['tabData']['orderStatus'],
          reflect: 'status',
          type: 'text',
          filter: (item) => {
            const status = item['status'];

            const map = __this.languagePack['repayList']['status2'];

            let desc = map.filter(item => {
              return item.value == status;
            });
            return (desc && desc[0].name) ? desc[0].name : "no";
          }
        }
      ],
      btnGroup: {
        title: this.languagePack['common']['operate']['name'],
        data: [
          {
            name: this.languagePack['repayList']['oper']['makeClear'],
            textColor: '#80accf',
            ico: 'anticon anticon-pay-circle-o',
            // showContion: {
            //   name: 'status',
            //   value: [1,3,5]
            // },
            bindFn: (item) => {
              this.selectItem = item;
              this.orderSer.getStream(item['orderId'])
                .pipe(
                  filter((res: Response) => {
                    if (res.success === false) {
                      this.msg.operateFail(res.message);
                    }
                    return res.success === true;
                  })
                )
                .subscribe(
                  (res : Response) => {
                    this.CxSerialNumber=[];
                    let data=(< Array<Object> >res.data).filter(item=>{
                      return item['isCancel']===false;
                    });
                    console.log(< Array<Object> >res.data);
                    data.forEach(item=>{
                      this.CxSerialNumber.push(
                        {
                          "serialNumber":item['serialNumber'],
                          "money":item['repayMoney'],
                          "manualRepaymentId" : item['id'],
                        }
                      )
                    });
                    console.log(this.CxSerialNumber);
                    this.hasClearForm.reset();
                    let userId = item.userId;
                    let currentRepay = item['currentRepay']+item['overDueFine'];
                    if(item['loanType']===1){
                      currentRepay=currentRepay+item['otherCost']
                    }
                    this.maxValue=currentRepay - item['realRepayMoney'];
                    let obj = {
                      'orderId': item['orderId'],
                      'repayMoney': (currentRepay-item['realRepayMoney']).toFixed(2),
                      'realRepayMoney': (item['realRepayMoney']).toFixed(2),
                      'currentRepay': (currentRepay-item['realRepayMoney']).toFixed(2),//应还
                      'isCancelRepayment': null,//撤销还款
                      'repaymentPlanId': item.id,
                      'userId': userId,
                      'loanType':item['loanType'],
                      'money' : null,//撤销还款金额
                      'isDone':null,
                      'repayType': null,//还款方式,
                      'serialNumber' : null,//流水号
                      'description':'',
                      'manualRepaymentId':null,
                      'repaymentDate':null,
                      'currentPeriod':item['currentPeriod'],
                      'totalPeriod':item['totalPeriod'],
                      'operator':1,
                      'operationResult':0
                    };
                    this.hasClearForm.patchValue(obj);
                    if(this.CxSerialNumber && this.CxSerialNumber.length>0){
                      if(item.status===4 || item.status===6){
                        this.hasClearForm.patchValue({
                          "isDone":1
                        });
                        this.operType=this.languagePack['repayList']['operType1'];
                      }else{
                        this.hasClearForm.patchValue({
                          "isDone":true
                        });
                        this.operType=this.languagePack['repayList']['operType'];
                      }
                      this.hasClearMark = true;
                    }else{
                      if(item.status===4 || item.status===6){
                        return;
                      }else{
                        this.hasClearForm.patchValue({
                          "isDone":false
                        });
                        this.operType=this.languagePack['repayList']['operType2'];
                        this.hasClearMark = true;
                      }
                    }
                  }
                )
            }
          }, {
            textColor: '#6f859c',
            name: this.languagePack['common']['btnGroup']['a'],
            ico: 'anticon anticon-file',
            showContion: {
              name: 'status',
              value: [1, 2, 3, 4, 5,6]
            },
            bindFn: (item) => {
              const status = item['status'];
              const map = __this.languagePack['repayList']['status1'];
              let name = map.filter(item => {
                return item.value == status;
              });
              let loanStatus = (name && name[0].name) ? name[0].name : 'no';
              this.router.navigate(['/order/detail'], {
                queryParams: {
                  order: item['orderId'],
                  userId: item['userId'],
                  loanStatus: loanStatus
                }
              });
            }
          }
        ]
      }
    };
    this.getList();
  }

  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    if(data.minPlanRepaymentDate){
      data.minPlanRepaymentDate = DateObjToString((<Date>data.minPlanRepaymentDate));
    }
    if(data.maxPlanRepaymentDate){
      data.maxPlanRepaymentDate = DateObjToString((<Date>data.maxPlanRepaymentDate));
    }
    this.searchCondition['status']=false;
    console.log(data);
    this.service.getList(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }
          this.tableData.loading = false;
          if (res.data && res.data['length'] === 0) {
            this.tableData.data = [];
            this.totalSize = 0;
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          let data_arr = res.data;
          console.log(res);
          this.tableData.data = (<Array<Object>>data_arr);
          if (res.page && res.page.totalNumber)
            this.totalSize = res.page.totalNumber;
          else
            this.totalSize = 0;
        }
      );
  };

  selectItem: object;

  hasClearMark: boolean = false;

  changeStatus(status: string) {
    // if (status === 'null') {
    //     this.reset();
    //     return false;
    // }
    // let statusArr = [];
    // statusArr.push(status);
    console.log(status);
    this.searchModel.currentPage = 1;
    this.searchModel.status = status;
    this.getList();
  };

  clearBill($event) {
    let postData = this.hasClearForm.value;
    if(postData.isDone ===false) {
      if (!postData.repayType) {
        let msg = this.languagePack['repayList']['tips']['repayChannel'];
        this.Cmsg.error(msg);
        return;
      }
      if (!postData.serialNumber) {
        let msg = this.languagePack['repayList']['tips']['serialNumber'];
        this.Cmsg.error(msg);
        return;
      }
      if (!postData.repaymentDate) {
        let msg = this.languagePack['repayList']['tips']['repaymentDate'];
        this.Cmsg.error(msg);
        return;
      }
      let post = {
        'currentPeriod':postData['currentPeriod'],
        'currentRepay': postData['currentRepay'],//应还
        'description':postData['description'],
        'isCancelRepayment':false,
        'isDone':false,
        'loanType':postData['loanType'],
        'operationResult':0,
        'operator':1,
        'orderId': postData['orderId'],
        'repayMoney': postData['repayMoney'],
        'repayType': postData['repayType'],//还款方式,
        'repaymentDate':unixTime(postData['repaymentDate']),
        'repaymentPlanId': postData['repaymentPlanId'],
        'serialNumber' : postData['serialNumber'],//流水号
        'totalPeriod':postData['totalPeriod'],
        'userId': postData['userId']
      };
      this.makeRepay(post);
    }
    if(postData.isDone===true){

      let obj = {
        'currentPeriod':postData['currentPeriod'],
        'currentRepay': postData['currentRepay'],
        'description':postData['description'],
        'isCancelRepayment':false,
        'isDone':true,
        'loanType':postData['loanType'],
        'operationResult':0,
        'operator':1,
        'orderId': postData['orderId'],
        'repayMoney': postData['repayMoney'],//应还
        'repayType': null,//还款方式,
        'repaymentDate':unixTime(new Date()),
        'repaymentPlanId': postData['repaymentPlanId'],
        'serialNumber' : null,//流水号
        'totalPeriod':postData['totalPeriod'],
        'userId': postData['userId']
      };
      this.makeRepay(obj);
    }
    else if(postData.isDone===1){
      if (!postData.serialNumber) {
        let msg = this.languagePack['repayList']['tips']['serial'];
        this.Cmsg.error(msg);
        return;
      }
      if (!postData.description) {
        let msg = this.languagePack['repayList']['tips']['remark'];
        this.Cmsg.error(msg);
        return;
      }
      let data = {
        'currentPeriod': postData['currentPeriod'],
        'currentRepay': postData['currentRepay'],
        'description': postData['description'],
        'isCancelRepayment': true,
        'isDone': false,
        'loanType':postData['loanType'],
        'operationResult': 0,
        'operator': 1,
        'orderId': postData['orderId'],
        'repayMoney': postData['money'],
        'repayType': null,//还款方式,
        'repaymentDate':  null,
        'repaymentPlanId': postData['repaymentPlanId'],
        'serialNumber' : postData['serialNumber'],//流水号
        'totalPeriod':postData['totalPeriod'],
        'userId': postData['userId'],
        'manualRepaymentId':postData['manualRepaymentId']
      };
      this.makeRepay(data);
    }

    // postData.repaymentDate = DateObjToString(postData.repaymentDate);
    //
    // let target = <HTMLButtonElement>$event.target;
    //
    // target.disabled = true;
    //
    // if (postData.isDone == 'false') {
    //   let currentRepay = this.selectItem['currentRepay'];
    //   let realRepay = postData.repayMoney / 1;
    //   if (realRepay > currentRepay) {
    //     let msg = this.languagePack['common']['tips']['overflow'];
    //     this.msg.operateFail(msg);
    //     target.disabled = false;
    //     return;
    //   }
    //   ;
    // }
    // ;
  };
  makeRepay(postData){
    // postData.repaymentDate = DateObjToString(postData.repaymentDate);
    // if(!postData.repaymentDate){
    //   postData.repaymentDate=DateObjToString( new Date());
    // }
    console.log(postData);
    this.service.makeRepay(postData)
      .pipe(
        filter((res: Response) => {

          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          this.readonly="readonly";
          // target.disabled = false;

          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.msg.operateSuccess();

          this.hasClearMark = false;

          this.getList();
        }
      );
  }
  cancel(){
    this.hasClearMark = false;
    this.hasClearForm.reset();
  }
  change(){
    let result=this.hasClearForm.get('isDone').value;
    if(result===1){

    }
  }
  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="orderNo";
    this.inputContent=null;
    this.getList();
  };

  pageChange($size: number, type: string): void {
    if (type == 'size') {
      this.searchModel.pageSize = $size;
    }
    if (type == 'page') {
      this.searchModel.currentPage = $size;
    }
    this.getList();
  };

  search() {
    this.searchModel.currentPage = 1;
    let name=this.selectModel;
    console.log(name);
    this.searchModel['creditOrderNo']=null;
    this.searchModel['orderNo']=null ;
    this.searchModel['userPhone'] =null ;
    this.searchModel['userName']=null ;
    this.searchModel[name.toString()]=this.inputContent;
    console.log(this.searchModel);
    this.getList();
  };

  // orderInfo : Object ;
  noteMark: boolean = false;

  orderDetail(orderId: number) {
    this.order.orderDetail(orderId)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.fetchFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.orderInfo = res.data;

          this.noteMark = true;
        }
      );
  };

  orderInfo: Object;

  getAllInfo(id: number) {
    forkJoin(
      [
        this.order.orderDetail(id),
        this.order.getRepaymentRecord({orderIds: id})
      ]
    )
      .pipe(
        filter(
          (res) => {

            if (res[0]['success'] === false) {
              this.msg.operateFail(res[0]['message']);
            }

            if (res[1]['success'] === false) {
              this.msg.operateFail(res[1]['message']);
            }

            return res[0]['success'] === true && res[1]['success'] === true;
          }
        )
      )
      .subscribe(
        (res) => {

          // this.orderDetail = res.data ;

          let plan = res[1]['data'] ? res[1]['data'][0] : [];

          this.orderInfo = {
            'order': res[0]['data'],
            'plan': plan
          };

          this.noteMark = true;
        }
      );
  };
  serialNumberChange(){
    let serialNumber=this.hasClearForm.get('serialNumber').value;
    if(serialNumber){
      let money=this.CxSerialNumber.filter(item=>{
        return item['serialNumber']===serialNumber;
      });
      this.hasClearForm.patchValue({
        "money": (money && money[0]['money']) ? money[0]['money'] : null,
        "manualRepaymentId":(money && money[0]['manualRepaymentId']) ? money[0]['manualRepaymentId'] : null,
      });
    }
  }
}
