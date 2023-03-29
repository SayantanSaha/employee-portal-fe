import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute} from "@angular/router";
import {State} from "../model/State";
import {District} from "../model/District";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {
  }
  employee:Employee| null = null;
  mode:string|null = null;
  editable:boolean = false;
  states:State[]=[];
  currDistricts:District[]=[];
  permDistricts:District[]=[];
  ngOnInit() {
    this.employeeService.getMyProfile()
      .subscribe(
        data=>{
          this.employee=data;
          this.currDistricts=this.getDistricts(this.employee.curr_state!);
          this.permDistricts=this.getDistricts(this.employee.perm_state!);
        }
      );
    this.employeeService.getStates().subscribe(
      data=>{
        this.states=data;
        console.log(this.states);
        },
      error => console.log(error)
    );

    this.mode = this.route.snapshot.paramMap.get('mode');
    this.setEditable(this.mode=='edit');
  }
  setEditable(status:boolean){
    this.editable = status;
  }
  compareState(oneState:State,othState:State): boolean{
    return oneState.id===othState.id;
  }
  compareDist(oneDist:District,othDist:District): boolean{
    return oneDist.id===othDist.id;
  }
  onStateChange(state:State,type:String){
    if(type=='curr'){
      this.currDistricts = this.getDistricts(state);
    }
    else if(type=='perm'){
      this.permDistricts = this.getDistricts(state);
    }
  }
  async getDistricts(state:State){
    let districts:District[] = [];
    districts = (await this.employeeService.getDistrictsByState(state.id!)).then(districts:District[]=>{return districts:District[];});
    console.log(districts);
    return districts;
  }

}
