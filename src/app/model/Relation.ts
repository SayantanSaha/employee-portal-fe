import {Dependent} from "./Dependent";

export class Relation{
  id: number | null = null;
  rel_desc: string | null = null;
  pivot: Dependent | null = null;
}
