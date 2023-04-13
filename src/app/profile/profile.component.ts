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
          this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
          this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
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
    console.log(oneDist);
    console.log(othDist);
    return oneDist.id===othDist.id;
  }
  onStateChange(state:State,type:String){
    if(type=='curr'){
      this.getDistricts(state).then(districts=>this.currDistricts=districts);
    }
    else if(type=='perm'){
      this.getDistricts(state).then(districts=>this.permDistricts=districts);
    }
  }
  savePrimaryDetails(){
    this.employeeService.updateEmployee(this.employee!).subscribe(
      data=>console.log(data),
      error=>console.log(error)
    );
  }
  async getDistricts(state:State){
    let districts:District[] = [];
    districts = await this.employeeService.getDistrictsByState(state.id!);
    console.log(districts);
    return districts;
  }

}
