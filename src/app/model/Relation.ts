import {Dependent} from "./Dependent";
import {Servants} from "./Servants";

export class Relation{
  id: number=0;
  emp_rel_id: number=0;
  rel_desc: string | null = null;
  allSelected: boolean = false;
  Selected_dh: boolean = false;
  pivot: Dependent  = new Dependent();
}


export class Domestic_help{
  id: number=0;
   // emp_rel_id: number=0;
  rel_desc: string | null = null;
  // pivot: Servants  = new Servants();
}
