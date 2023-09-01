import {District} from "./District";
import {State} from "./State";
import {Designation} from "./Designation";
import {Division} from "./Division";
import {Relation} from "./Relation";
import {Organization} from "./Organization";

export class Employee{
  id: number|null = null;
  emp_title: string = '';
  emp_name: string = '';
  emp_title_hi: string = '';
  emp_name_hi: string = '';
  doj_rb: Date|null = null;
  doj_gs: Date|null = null;
  gender: string = '';
  dob: Date|null = null;
  dor: Date|null = null;
  email_id: string  = '';
  mobile: string  = '';
  profile_photo: string|null = null;
  perm_add: string |null = null;
  perm_pin: string |null = null;
  perm_district: District | null = null;
  perm_state: State | null = null;
  curr_add: string | null = null;
  curr_pin: string | null = null;
  curr_district: District | null = null;
  curr_state: State | null = null;
  created_at: Date | null = null;
  updated_at: Date | null = null;
  designations: Designation[]|null = null;
  divisions: Division[]|null = null;
  relations: Relation[]|null = [];
  organization: Organization|null = null;
}
