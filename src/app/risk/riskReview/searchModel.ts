export class SearchModel {
  type:string=null;
  paramName:string='';
  status:string=null;


  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
