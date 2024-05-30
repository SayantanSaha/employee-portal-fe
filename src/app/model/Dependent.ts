import {Vehicles} from "./Vehicles";
import {Ebapass} from "./Ebapass";

export class Dependent{
  id?: number = -1 ;

  employee_id: number=0;
  relation_id: number=0;
  service_id: number=0;
  gender: string | null = null;
  rel_name: string | null = null;
  rel_dob: Date | null = null;
  rel_mobile_no: string | null = null;
  deleted_at: Date | null = null;
  eba_passes:  Ebapass[] = [];
}

