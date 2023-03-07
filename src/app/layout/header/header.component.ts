import { Component } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {


  expandContract() {
    /*const el = document.getElementById("menu")
    el.classList.toggle('expanded')
    el.classList.toggle('collapsed')*/
    jQuery("#menu").slideToggle("slow");
  }
}
