import {District} from "./District";
import {State} from "./State";
import {Designation} from "./Designation";
import {Division} from "./Division";
import {Relation} from "./Relation";
import {Organization} from "./Organization";
import {Idcards} from "./Idcards";
import {Servants} from "./Servants";
import {ServantRel} from "./ServantRel";
import {Vehicles} from "./Vehicles";



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

  perm_add: string |null = null;
  perm_pin: string |null = null;
  perm_state: State | null = null;
  perm_district: District | null = null;
  vehicle_no:string | null = null;
  curr_add: string | null = null;
  curr_pin: string | null = null;
  curr_state: State | null = null;
  curr_district: District | null = null;
  qtr_code: string | null = null;
  blck_code:string | null = null;
  location_id:string | null = null;
  qtr_address:string |null =null;
  created_at: Date | null = null;
  updated_at: Date | null = null;
  profile_photo: string|null = null;
  relations: Relation[]|null = [];
  servants: Servants[]|null = [];
  // servant_relations:ServantRel[]|null=[];

  eba_applications: any;
  eba_passes:any;
  eba_applicationsstatus :any;
  vehicles: Vehicles[]|null = [];
  divisions: Division[]|null = null;
  organization: Organization|null = null;
  designations: Designation[]|null = null;
  //aadhar_card: string|null = null;
  sign_path: string|null = null;
  id_cards: Idcards[]|null = null;
  temp_changes: any;



}
