import {Posting} from "./Posting";

export class Division {
  id : number = 0;
  div_desc : string = '';
  org_id: number | null = null;;
  pivot: Posting = new Posting();
}
