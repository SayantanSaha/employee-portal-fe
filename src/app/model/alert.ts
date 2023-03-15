export class Alert{
  type:string='';
  msg:string='';

  constructor(type:string,msg:string) {
    this.type = type;
    this.msg = msg;
  }
}
