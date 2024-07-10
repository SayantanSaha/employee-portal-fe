export class Posting{
  id: number = -1;
  employee_id: number | null = null;
  division_id: number | null = null;
  active: boolean=false;
  from_date: Date | null = null;
  order_date: Date | null = null;
  order_no: string = '';
  order_path: string = '';
  order_path_64:  boolean=false;
  to_date: Date | null = null;
  deleted_at: Date | null = null;
  last_updated_from: string = '';
  last_updated_by: number = 0;
}
