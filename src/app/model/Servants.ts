import {ServantRel} from "./ServantRel";
import {Vehicles} from "./Vehicles";

export class Servants{
  id?: number = -1 ;
  employee_id: number=0;
  // servant_id: number=0;
  gender: string | null = null;
  servant_name: string | null = null;
  servant_dob: Date | null = null;
  servant_mobile_no: string | null = null;
  out_house_address: string | null = null;
  deleted_at: Date | null = null;
  allSelected: boolean = false;
  // out_house_id: number=-1;
  relations: ServantRel[]  = [];
  eba_passes: any[]|null = [];
  vehicles: Vehicles[]|null = [];
}

