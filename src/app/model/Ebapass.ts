export class Ebapass{
  id: number|null = null;
  eba_pass_no: string|null = null;
  active: boolean=false;
  eba_app_id: number|null = null;
  employee_id: number|null = null;
  emp_rel_id: number|null = null;
  servant_id: number|null = null;
  servant_rel_id: number|null = null;

  eba_pass_exp_date: any| null = null;
  eba_pass_exp_date_edit: any| null = null;
  eba_pass_exp_date_edited: boolean=false;
  curr_address: string | null = null;
  created_at: Date|null = null;
  updated_at: Date|null = null;
  deleted_at: Date|null = null;
  last_updated_from : string | null = null;
  last_updated_by: number|null = null;
  living_at_president_sect: Date|null = null;
  perm_address: string | null = null;
  last_5yr_address : string | null = null;
  reference_1_name : string | null = null;
  reference_1_phone_no: string | null = null;
  reference_1_address : string | null = null;
  reference_2_name    : string | null = null;
  reference_2_phone_no  : string | null = null;
  reference_2_address   : string | null = null;

  id_proof_path : any | null = null;
  id_proof_path_64 : any | null = null;
  id_proof_path_edit : any | null = null;
  id_proof_path_edit_64 : any | null = null;

  photo_path   : any | null = null;
  photo_path_64   : any | null = null;
  photo_path_edit  : any | null = null;
  photo_path_edit_64  : any | null = null;

  sign_path   : any | null = null;
  sign_path_edit   : any | null = null;
  sign_path_64   : any | null = null;
  sign_path_edit_64   : any | null = null;

  curl_post:boolean=false;
  print:boolean=false;
  remark: string|null=null;


  apply_reason:string|null=null;
  apply_remark:string|null=null;
  FIR_no:string|null=null;
  receipt_no:string|null=null;
  fir_pdf:any | null = null;
  fir_pdf_64 : any | null = null;
  fir_pdf_edit : any | null = null;
  fir_pdf_edit_64 : any | null = null;
}
