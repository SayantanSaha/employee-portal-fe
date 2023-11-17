import {Servants} from "./Servants";

export class Outhouse {
  id?: number = -1 ;
  employee_id: number=0;
  deleted_at: Date | null = null;
  servants: Servants[] = [];
}
