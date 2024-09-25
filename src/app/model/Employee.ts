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
  body_mark:string = '';
  police_verification_no:string = '';
  blood_group:string='';
  doj_rb: Date|null = null;
  doj_gs: Date|null = null;
  applied_date: Date|null = null;
  gender: string = '';
  dob: Date|null = null;
  dor: any| null = null;
  email_id: string  = '';
  mobile: string  = '';
  AllotmentId: string ='';
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
  blck: string | null = null;
  blck_code:string | null = null;
  location_id:string | null = null;
  qtr:any |null =null;
  created_at: Date | null = null;
  updated_at: Date | null = null;
  profile_photo: string|null = null;
  relations: Relation[]|null = [];
  closefamily: Relation[]|null = [];
  father_name:string|null=null;
  family: Relation[]|null = [];
  servants: Servants[]|null = [];
  // servant_relations:ServantRel[]|null=[];

  eba_applications: any;
  eba_passes:any;
  eba_applicationsstatus :any;
  newApplicationStatus:any;
  vehicles: Vehicles[]|null = [];
  divisions: Division[]|null = null;
  organization: Organization|null = null;
  designations: Designation[]|null = null;
  division: any | null = null;
  org: any | null = null;
  designation: any | null = null;
  id_proof: string|null = null;
  id_proof_64: boolean = false;
  postingOrder:string|null = null;
  emp_type:string|null = null;
  Recruitment:string|null = null;
  sign_path: string|null = null;
  id_cards: Idcards[]|null = null;
  temp_changes: any;
  dh: boolean = false;
  so: boolean = false;
  us: boolean = false;
  director: boolean = false;
  asp: boolean = false;
  dcp: boolean = false;
  dh_dcp: boolean = false;
  approve: boolean = false;
  returnshow: boolean = false;
  visual: boolean = false;
  visual_dcp: boolean = false;
  reg_no:string|null = null;
  status:string|null = null;
  desg_print:string|null = null;
  passColor:string|null = null;
  passColor_issued:string|null = null;
  payLevel:any | null = null;
  validupto: Date | null = null;
  apply_reason:string|null = null;
  FIR_no:string|null = null;
  ebapurpleCard: boolean = false;
}
