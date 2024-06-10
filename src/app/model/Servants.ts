import {ServantRel} from "./ServantRel";
import {Vehicles} from "./Vehicles";
import {Ebapass} from "./Ebapass";

export class Servants{
  id?: number = -1 ;
  employee_id: number| null = null;;
  // servant_id: number=0;
  gender: string | null = null;
  servant_name: string | null = null;
  servant_dob: Date | null = null;
  servant_mobile_no: string | null = null;
  out_house_address: string | null = null;
  deleted_at: Date | null = null;
  allSelected: boolean = false;
  Selected_dh: boolean = false;
  reference: boolean = false;
  // out_house_id: number=-1;
  relations: ServantRel[]  = [];
  eba_passes: Ebapass[] = [];
  vehicles: Vehicles[]|null = [];
  showVehiclePart: boolean = false;
}

