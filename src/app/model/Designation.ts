import {Promotion} from "./Promotion";

export class Designation{
  id: number=0;
  desg_desc: string='';
  org_id: number | null = null;;
  pivot: Promotion  = new Promotion();
}
