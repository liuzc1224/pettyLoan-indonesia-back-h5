export class SearchModel {
  startDate:any="";
  endDate:any="";
  solve:boolean=null;
  phoneNumber: any="";


  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
