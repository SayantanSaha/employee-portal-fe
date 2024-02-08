import {Ebapass} from "./Ebapass";

export class ServantRel {
    id?: number = -1;
    deleted_at: Date | null = null;
    rel_desc: string | null = null;
    allSelected: boolean = false;


    pivot: {
        id: number;
        employee_id: number;
        relation_id: number | null;
        servant_id: number | null;
        gender: string | null;
        rel_name: string | null;
        rel_dob: Date | null;
        rel_mobile_no: string | null;
        deleted_at: Date | null;
        eba_passes: Ebapass[] ;
        id_proof_path: string|null ;
        photo_path: string|null;
        sign_path: string|null ;
    } = {
        id: -1,
        employee_id:0,
        relation_id: null,
        servant_id: null,
        gender: null,
        rel_name: null,
        rel_dob: null,
        rel_mobile_no: null,
        deleted_at: null,
        eba_passes:  [],
        id_proof_path:  null,
        photo_path: null,
        sign_path:  null
    };

}


