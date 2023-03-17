import {District} from "./District";
import {State} from "./State";

export class Employee{
  id: number|null = null;
  emp_name: string = '';
  doj: Date|null = null;
  email_id: string  = '';
  mobile: string  = '';
  perm_add: string |null = null;
  perm_pin: string |null = null;
  perm_dist: District | null = null;
  perm_state: State | null = null;
  curr_add: string | null = null;
  curr_pin: string | null = null;
  curr_dist: District | null = null;
  curr_state: State | null = null;
  created_at: Date | null = null;
  updated_at: Date | null = null;
}
