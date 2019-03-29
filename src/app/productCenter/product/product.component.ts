import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {TableData} from '../../share/table/table.model';
import {CommonMsgService, MsgService} from '../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage';
import {SearchModel} from './searchModel';
import {ProductService} from '../../service/productCenter';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model';

let __this;

@Component({
  selector: '',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: ProductService,
  ) {
  } ;

  languagePack: Object;
  tableData: TableData;
  searchModel : SearchModel = new SearchModel() ;
  inputData:Array< String >;
  inputValue='id';
  totalSize : number = 0 ;
  isVisible:Boolean=false;
  isDelete:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  stateData:Array< String >;
  typeData:Array< String >;
  validForm : FormGroup;
  ngOnInit() {
    __this = this;
    this.validForm = this.fb.group({
      "id":null,
      "loanProductName" : [null , [Validators.required] ] ,
      "loanProductType" : [1 , [Validators.required] ] ,
      "loanQuotaMax":[0 , [Validators.required] ] ,
      "loanQuotaMix":[0 , [Validators.required] ] ,
      "loanQuotaIncrease":[1 , [Validators.required] ] ,
      "loanTermMax":[0 , [Validators.required] ] ,
      "loanTermMix":[0 , [Validators.required] ] ,
      "loanTermIncrease":[1 , [Validators.required] ] ,
      "loanDayRate":[0 , [Validators.required] ] ,
      "annualInterestRate":[0 , [Validators.required] ] ,
      "technologyRate":[0 , [Validators.required] ] ,
      "auditRate":[0 , [Validators.required] ] ,
      "gracePeriod":[0 , [Validators.required] ],
      "gracePeriodDayRate":[0 , [Validators.required] ] ,
      "overdueDayRate":[0 , [Validators.required] ] ,
      "status" : [1,[Validators.required]] ,
    });
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['productCenter.product', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data:data['productCenter.product'],
            list: data['productCenter.product']['list']
          };
          this.inputData=data['productCenter.product']['input'];
          this.stateData=data['productCenter.product']['state'];
          this.typeData=data['productCenter.product']['type1'];
        }
      );
    this.initialTable() ;
  };

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: false,
      tableTitle: [
        {
          name: __this.languagePack['list']['id'],
          reflect: "id",
          type: "text"
        },
        {
          name: __this.languagePack['list']['name'],
          reflect: "loanProductName",
          type: "text"
        },
        {
          name: __this.languagePack['list']['type'],
          reflect: "loanProductType",
          type: "text",
          filter: (item) => {
            let type=__this.typeData.filter(v => {
              return v.value===item['loanProductType']
            });
            return (type.length>0 && type[0]['desc']) ? type[0]['desc'] : "";
          }
        },
        {
          name: __this.languagePack['list']['creationTime'],
          reflect: "createTimeStr",
          type: "text",
        },
        {
          name: __this.languagePack['list']['updateTime'],
          reflect: "modifyTimeStr",
          type: "text",
        },
        {
          name: __this.languagePack['list']['amount']+"（REAL）",
          reflect: "loanQuotaMax",
          type: "text",
          filter: (item) => {
            let loanQuota;
            const loanQuotaMax = item['loanQuotaMax'] ? item['loanQuotaMax'] : 0;
            const loanQuotaMix = item['loanQuotaMix'] ? item['loanQuotaMix'] : 0;
            loanQuota=loanQuotaMix+"-"+loanQuotaMax;
            return (loanQuota) ? loanQuota : "";
          }
        },
        {
          name: __this.languagePack['list']['period'],
          reflect: "loanTermMax",
          type: "text",
          filter: (item) => {
            let loanTerm;
            const loanTermMax = item['loanTermMax'] ? item['loanTermMax'] : 0;
            const loanTermMix = item['loanTermMix'] ? item['loanTermMix'] : 0;
            loanTerm=loanTermMix+"-"+loanTermMax;
            let type=__this.typeData.filter(v => {
              return v.value===item['loanProductType']
            });
            let time=(type.length>0 && type[0].time) ? type[0].time : "";
            loanTerm=loanTerm+" "+time;

            return (loanTerm) ? loanTerm : "";
          }
        },
        {
          name: __this.languagePack['list']['loanRate'],
          reflect: "loanDayRate",
          type: "text",
          filter: (item) => {
            const loanRate = item['loanDayRate'];
            let type=__this.typeData.filter(v => {
              return v.value===item['loanProductType']
            });
            let time=(type.length>0 && type[0].interestRate) ? type[0].interestRate : "";

            return (loanRate) ? this.mul(loanRate,100)+" % ("+time+")" : "";
          }
        },
        {
          name: __this.languagePack['list']['gracePeriod'],
          reflect: "gracePeriod",
          type: "text",
          filter: (item) => {
            const gracePeriod = item['gracePeriod'];
            return (gracePeriod) ? gracePeriod +"("+__this.languagePack['data']['type1'][0]['time']+")" : 0;
          }
        },
        {
          name: __this.languagePack['list']['gracePeriodDayRate'],
          reflect: "gracePeriodDayRate",
          type: "text",
          filter: (item) => {
            const gracePeriodDayRate = item['gracePeriodDayRate'];
            return (gracePeriodDayRate) ? this.mul(gracePeriodDayRate,100)+" %" : "";
          }
        },
        {
          name: __this.languagePack['list']['overdueDayRate'],
          reflect: "overdueDayRate",
          type: "text",
          filter: (item) => {
            const overdueDayRate = item['overdueDayRate'];
            return (overdueDayRate) ? this.mul(overdueDayRate,100)+" %" : "";
          }
        },
        {
          name: __this.languagePack['list']['state'],
          reflect: "status",
          type: "text",
          filter: (item) => {
            let type=__this.stateData.filter(v => {
              return v.value===item['status']
            });
            return (type.length>0 && type[0].desc) ? type[0].desc : "";
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: "#0000ff",
          name: __this.languagePack['common']['operate']['edit'],
          bindFn: (item) => {
            __this.validForm.patchValue({
              "id":item.id,
              "loanProductName" : item.loanProductName ,
              "loanProductType" :item.loanProductType ,
              "loanQuotaMax":item.loanQuotaMax,
              "loanQuotaMix":item.loanQuotaMix ,
              "loanQuotaIncrease":item.loanQuotaIncrease ,
              "loanTermMax":item.loanTermMax ,
              "loanTermMix":item.loanTermMix ,
              "loanTermIncrease":item.loanTermIncrease,
              "loanDayRate":__this.mul(item.loanDayRate,100) ,
              "annualInterestRate":__this.mul(item.annualInterestRate,100) ,
              "technologyRate":__this.mul(item.technologyRate,100) ,
              "auditRate":__this.mul(item.auditRate,100) ,
              "gracePeriod":item.gracePeriod,
              "gracePeriodDayRate":__this.mul(item.gracePeriodDayRate,100) ,
              "overdueDayRate":__this.mul(item.overdueDayRate,100) ,
              "status" : item.status ,
            });
            __this.isVisible=true;
          }
        },{
          textColor: "#0000ff",
          name: __this.languagePack['common']['operate']['delete'],
          bindFn: (item) => {
            this.isDelete=true;
            this.sgo.set('ProductId', {
              id: item.id,
            });
          }
        }]
      }
    };
    this.getList();
  }
  getList(){
    this.tableData.loading = true ;
    let model=this.searchModel;
    model.columns=['status'];
    model.orderBy=[false];
    this.service.getProduct(model)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }
        }
      );
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    };
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    };
    this.getList() ;
  };
  add(){
    this.validForm.reset();
    this.validForm.patchValue({
      "loanProductType" : 1 ,
      "loanQuotaMax":0 ,
      "loanQuotaMix":0 ,
      "loanQuotaIncrease":1 ,
      "loanTermType":1,
      "loanTermMax":0 ,
      "loanTermMix":0 ,
      "loanTermIncrease":1 ,
      "loanDayRate":0 ,
      "annualInterestRate":0 ,
      "technologyRate":0 ,
      "auditRate":0 ,
      "gracePeriod":0 ,
      "gracePeriodDayRate":0 ,
      "overdueDayRate":0 ,
      "status" : 1,
    });
    this.isVisible=true;
  }
  search(){
    this.getList();
  }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
  keyupId(){
    let val=this.searchModel.id;
    this.searchModel.id=val.replace(/[^0-9]/g,'');
    console.log(this.searchModel.id);
  }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid;
    let postData = this.validForm.value;
    if (!valid || postData['loanQuotaMax']===0 || postData['loanQuotaMix']===0 || postData['loanTermMax']===0 || postData['loanTermMix']===0 || postData['loanDayRate']===0 || postData['annualInterestRate']===0 || postData['technologyRate']===0 || postData['auditRate']===0 || postData['gracePeriodDayRate']===0 || postData['overdueDayRate']===0){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    let loanQuota=postData['loanQuotaMax']-postData['loanQuotaMix'];
    let loanQuotaIncrease=postData['loanQuotaIncrease'];
    if(loanQuota<0 || loanQuotaIncrease===0){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['msg']['amount']);
      return;
    }
    if(loanQuota % loanQuotaIncrease !=0){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['msg']['amount']);
      return;
    }
    let loanTerm=postData['loanTermMax']-postData['loanTermMix'];
    let loanTermIncrease=postData['loanTermIncrease'];
    if(loanTerm<0 || loanTermIncrease===0){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['msg']['period']);
      return;
    }
    if(loanTerm % loanTermIncrease !=0){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['data']['msg']['period']);
      return;
    }
console.log(postData);
    postData['loanDayRate']=this.div(postData['loanDayRate'],100);
    postData['annualInterestRate']=this.div(postData['annualInterestRate'],100);
    postData['technologyRate']=this.div(postData['technologyRate'],100);
    postData['auditRate']=this.div(postData['auditRate'],100);
    postData['gracePeriodDayRate']=this.div(postData['gracePeriodDayRate'],100);
    postData['overdueDayRate']=this.div(postData['overdueDayRate'],100);

    console.log(postData);
    if(postData["id"]){
      this.updateProduct(postData);
    }else{
      this.addProduct(postData);
    }
  }

  updateProduct(data){
    this.isOkLoading=true;
    this.service.updateProduct(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          this.isVisible = false;
          this.getList();
        }
      );
  }
  addProduct(data){
    this.isOkLoading=true;
    this.service.addProduct(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          console.log(res.data);
          this.isVisible = false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("ProductId").id
    };
    this.service.deleteProduct(data)
      .pipe(
        filter( (res : Response) => {
          this.isDeleteLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isDelete=false;
          this.getList();
        }
      );
  }
  keyup(name){
    let value=this.validForm.get(name).value;
    value = value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g,""); //验证第一个字符是数字
    value = value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    let num=value.indexOf(".");
    if(num< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value= parseFloat(value);
    }
    if(num> -1 ){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额

      let before=value.substring(0,num);
      let after=value.substring(num);
      if(before!=="0"){
        before= parseFloat(before);
        value= before+""+after;
      }
    }
    this.validForm.patchValue({
      [name]:value
    })
  }
  Number(name){
    let value=this.validForm.get(name).value;
    value=value.replace(/[^\d]/g,'');
    if(value.length>1){
      if(value.substring(0,1)==='0'){
        value=value.substr(1);
      }
    }
    this.validForm.patchValue({
      [name]:value
    })
  }
  setType(){
    let value=this.validForm.get('loanProductType').value;
    this.validForm.patchValue({
      loanTermType:value
    });
  }
  // add(a,b){
  //   let c, d, e;
  //   try {
  //     c = a.toString().split(".")[1].length;
  //   } catch (f) {
  //     c = 0;
  //   }
  //   try {
  //     d = b.toString().split(".")[1].length;
  //   } catch (f) {
  //     d = 0;
  //   }
  //   return e = Math.pow(10, Math.max(c, d)),(this.mul(a, e) + this.mul(b, e)) / e;
  // }
  mul(a, b) {
    let c = 0,
      d = a.toString(),
      e = b.toString();
    try {
      c += d.split(".")[1].length;
    } catch (f) {}
    try {
      c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  }
  sub(a,b){
    let c, d, e;
    try {
      c = a.toString().split(".")[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split(".")[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
  }
  div(a, b){
    let c, d, e = 0,
      f = 0;
    try {
      e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
      f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
  }

}
