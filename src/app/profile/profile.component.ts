import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {Employee} from "../model/Employee";
import {EmployeeService} from "../employee.service";
import {ActivatedRoute} from "@angular/router";
import {State} from "../model/State";
import {District} from "../model/District";
import {Designation} from "../model/Designation";
import {Division} from "../model/Division";


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
  designations:Designation[]=[];
  divisions:Division[]=[];
  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.setEditable(this.mode=='edit');
    this.employeeService.getMyProfile()
      .subscribe(
        data=>{
          this.employee=data;

          this.getDistricts(this.employee.curr_state!).then(districts=>this.currDistricts=districts);
          this.getDistricts(this.employee.perm_state!).then(districts=>this.permDistricts=districts);
        }
      );
    this.employeeService.getStates().subscribe(
      data=>this.states=data,
      error => console.log(error)
    );
    this.employeeService.getDesignations(1).subscribe(
      data=>this.designations=data,
      error => console.log(error)
    );
    this.employeeService.getDivisions(1).subscribe(
      data=>this.divisions=data,
      error => console.log(error)
    );
    /*this.employeeService.getDependents(this.employee?.id!).subscribe(
      data=>this.employee!.relations=data,
      error => console.log(error)
    );*/


  }
  setEditable(status:boolean){
    this.editable = status;
  }
  compareState(oneState:State,othState:State): boolean{
    if(oneState==null && othState==null)
      return true;
    else if(oneState!=null && othState!=null)
      return oneState.id===othState.id;
    else
      return false;
  }
  compareDesignation(first:Designation,second:Designation): boolean{
    return first !=null && second!=null && first==second ;//&& first.id===second.id
  }
  compareDivisions(first:Division,second:Division): boolean{
    return first !=null && second!=null && first==second ;// && first.id===second.id
  }
  compareDist(oneDist:District,othDist:District): boolean{
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
    if(state!=null)
    {
      districts = await this.employeeService.getDistrictsByState(state.id!);
    }
    return districts;
  }
  addDesignation() {
      let d = new Designation();
      d.pivot.employee_id = this.employee?.id!;
      this.employee?.designations?.push(d);
  }
  addDivision() {
    this.employee?.divisions?.push(new Division());
  }
  savePromotion(index:number){
    let promotion = this.employee?.designations![index].pivot;
    if(promotion?.id==-1){
       this.employeeService.savePromotion(promotion).subscribe(
        p=>this.employee!.designations![index]=p,
         e=>console.log(e)
      );
    }
    else{
      if(promotion!=null){
        this.employeeService.updatePromotion(promotion).subscribe(
          p=>this.employee!.designations![index]=p,
          e=>console.log(e)
        );
      }
    }
  }

  deleteRecord(index:number) {
    let promotion = this.employee?.designations![index].pivot;
    if(promotion?.id==-1){
      this.employee?.designations!.splice(index);
    }
    else{
      if(promotion!=null){
        promotion!.active=false;
        this.employeeService.updatePromotion(promotion).subscribe(
          p=>this.employee!.designations![index]=p,
          e=>console.log(e)
        );
      }

    }
  }

  activateRecord(index: number) {
    let promotion = this.employee?.designations![index].pivot;
    if(promotion!=null){
      promotion!.active=true;
      this.employeeService.updatePromotion(promotion).subscribe(
        p=>this.employee!.designations![index]=p,
        e=>console.log(e)
      );
    }
  }
}
