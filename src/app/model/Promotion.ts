export class Promotion {
  id?: number = -1;
  employee_id: number| null = null;
  designation_id: number | null = null;
  pay_id: number | null = null;
  paydesc: string = '';
  active: boolean = false;
  join_date: Date | null = null;
  order_date: Date | null = null;
  order_no: string = '';
  order_path: string = '';
  order_path_64: boolean = false;
  deleted_at: Date | null = null;
  last_updated_from: string = '';
  last_updated_by: string = '';
  desg_print:string = '';
}
