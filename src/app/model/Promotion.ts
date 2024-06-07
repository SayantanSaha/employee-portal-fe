export class Promotion {
  id?: number = -1;
  employee_id: number=0;
  designation_id: number = 0;
  active: boolean = false;
  join_date: Date | null = null;
  order_date: Date | null = null;
  order_no: string = '';
  order_path: string = '';
  deleted_at: Date | null = null;
  last_updated_from: string = '';
  last_updated_by: string = '';
  desg_print:string = '';
}
