export class Posting{
  id: number = -1;
  employee_id: number = 0;
  division_id: number = 0;
  active: boolean=false;
  from_date: Date | null = null;
  order_date: Date | null = null;
  order_no: string = '';
  order_path: string = '';
  to_date: Date | null = null;
  deleted_at: Date | null = null;
  last_updated_from: string = '';
  last_updated_by: number = 0;
}
