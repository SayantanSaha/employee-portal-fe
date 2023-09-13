import {Component, Inject} from '@angular/core';
import {User} from "../../model/User";
declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent  {

  user:User = new User();

  baseUrl: string = '';
  constructor( @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  ngOnInit() {
    let userString:string|null = sessionStorage.getItem('user')!=null?sessionStorage.getItem('user'):'[]';
    this.user = JSON.parse(userString!);
  }

  expandContract() {
    /*const el = document.getElementById("menu")
    el.classList.toggle('expanded')
    el.classList.toggle('collapsed')*/
    jQuery("#menu").slideToggle("slow");
  }
}
