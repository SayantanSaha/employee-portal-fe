import {ServantRel} from "./ServantRel";

export class Servants{
  id?: number = -1 ;
  employee_id: number=0;
  // servant_id: number=0;
  gender: string | null = null;
  servant_name: string | null = null;
  servant_dob: Date | null = null;
  servant_mobile_no: string | null = null;
  deleted_at: Date | null = null;
  out_house_id: number=-1;
  // relation: ServantRel  = new ServantRel();
  eba_passes: any[]|null = [];
}

