import {Dependent} from "./Dependent";

export class Relation{
  id: number=0;
  emp_rel_id: number=0;
  rel_desc: string | null = null;
  pivot: Dependent  = new Dependent();
}
