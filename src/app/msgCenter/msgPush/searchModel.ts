export class SearchModel {
  pushTimeStart:any="";
  pushTimeEnd:any="";
  subject:string="";
  pushStatus:number=null;



  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
