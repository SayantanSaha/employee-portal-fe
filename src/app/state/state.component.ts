import {Component, OnInit} from '@angular/core';
import {State} from "../model/State";
import {EmployeeService} from "../employee.service";
import {Alert} from "../model/alert";

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit{
  states:State[];
  selectedState:State;
  alerts:Alert[] = [];

  constructor(
    private employeeService: EmployeeService
  ) {
    this.selectedState = new State();
    this.states=[];

  }

  ngOnInit() {
    this.employeeService.getStates().subscribe(
      states=>{
        this.states=states.sort((a,b)=>a?.state_name!<b?.state_name!?-1:1);
        console.log(states);
        console.log(this.states);
      },
      error => {
        let alert = new Alert('danger','Could not fetch list of States');
        this.alerts.push(alert);
        //console.log(error);
      }
    );
  }


}
