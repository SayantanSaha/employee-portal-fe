"use strict";(self.webpackChunkemployee_portal=self.webpackChunkemployee_portal||[]).push([[489],{2489:(T,p,c)=>{c.r(p),c.d(p,{DashboardModule:()=>k});var l=c(6814),d=c(776),g=c(4611),e=c(9212),h=c(6906);function _(t,s){if(1&t){const i=e.EpF();e.ynx(0),e.TgZ(1,"div",3),e.NdJ("click",function(o){e.CHM(i);const r=e.oxw(3);return e.KtG(r.hoverClick(o))}),e.TgZ(2,"a",4)(3,"div",5),e._UZ(4,"img",23),e.TgZ(5,"h5",7),e._uU(6,"Admin"),e.qZA(),e.TgZ(7,"p",8),e._uU(8,"Click here to Verify Officer Details"),e.qZA()()()(),e.BQk()}2&t&&(e.xp6(2),e.Q6J("routerLink","/adminpanel"))}function m(t,s){if(1&t){const i=e.EpF();e.ynx(0),e.TgZ(1,"div",9),e.NdJ("click",function(o){e.CHM(i);const r=e.oxw(3);return e.KtG(r.hoverClick(o))}),e.TgZ(2,"a",4)(3,"div",5),e._UZ(4,"img",24),e.TgZ(5,"h5",7),e._uU(6,"EBA"),e.qZA(),e.TgZ(7,"p",8),e._uU(8,"Click here to Verify applied EBA Applications"),e.qZA()()()(),e.BQk()}2&t&&(e.xp6(2),e.Q6J("routerLink","/ebapanel"))}function u(t,s){if(1&t){const i=e.EpF();e.ynx(0),e.TgZ(1,"div",9),e.NdJ("click",function(o){e.CHM(i);const r=e.oxw(3);return e.KtG(r.hoverClick(o))}),e.TgZ(2,"a",4)(3,"div",5),e._UZ(4,"img",25),e.TgZ(5,"h5",7),e._uU(6,"DCP office"),e.qZA(),e.TgZ(7,"p",8),e._uU(8,"Click here to Verify applied EBA Applications"),e.qZA()()()(),e.BQk()}2&t&&(e.xp6(2),e.Q6J("routerLink","/ebapanel"))}function v(t,s){if(1&t&&(e.ynx(0),e.YNc(1,_,9,1,"ng-container",21)(2,m,9,1,"ng-container",21)(3,u,9,1,"ng-container",21),e.BQk()),2&t){const i=s.$implicit;e.xp6(),e.Q6J("ngIf",1===i),e.xp6(),e.Q6J("ngIf",4===i||5===i||6===i||9===i||10===i),e.xp6(),e.Q6J("ngIf",4===i||5===i||6===i||9===i||10===i)}}function f(t,s){if(1&t&&(e.ynx(0),e.YNc(1,v,4,3,"ng-container",22),e.BQk()),2&t){const i=e.oxw();e.xp6(),e.Q6J("ngForOf",i.user.role)}}const Z=[{path:"",component:(()=>{class t{constructor(i){this.employeeService=i,this.user=new g.n,this.employee=null,this.cardnumber=1,this.imageUrls=["https://ih1.redbubble.net/image.1492450570.5434/flat,1000x1000,075,f.u1.jpg","https://images.mid-day.com/images/images/2023/jan/droupadi-murmu-president-PTI_d.jpg","https://i.pinimg.com/originals/49/32/ea/4932eadc4ab95268fb0caf51e7e1ccfb.jpg"],this.currentImageUrl=this.imageUrls[0],this.currentIndex=0}ngOnInit(){let i=null!=sessionStorage.getItem("user")?sessionStorage.getItem("user"):"[]";this.user=JSON.parse(i),this.changeBackgroundImage(),this.employeeService.getMyProfile().subscribe(n=>{this.employee=n},n=>{console.error("Error fetching employee data:",n)})}changeBackgroundImage(){setInterval(()=>{this.currentImageUrl=this.imageUrls[this.currentIndex],this.currentIndex=(this.currentIndex+1)%this.imageUrls.length},7e3)}addHoverClass(){const i=document.querySelector(".card");i&&i.classList.add("hovered")}removeHoverClass(){const i=document.querySelector(".card");i&&i.classList.remove("hovered")}hoverClick(i){const n=i.currentTarget;n&&(n.classList.add("clicked"),setTimeout(()=>{n.classList.remove("clicked")},200))}applyEvahaan(){this.employeeService.applyEvahaan().subscribe(i=>{console.log(i),window.open(i,"_self")},i=>{console.log(i),console.log(i.status),console.log(i.error)})}static#e=this.\u0275fac=function(n){return new(n||t)(e.Y36(h.G))};static#i=this.\u0275cmp=e.Xpm({type:t,selectors:[["app-dashboard"]],decls:74,vars:6,consts:[[1,"container"],[1,"row"],[2,"font-size","20px"],[1,"card","shadow",2,"width","240px","height","140px",3,"click"],[2,"text-decoration","none","color","inherit",3,"routerLink"],[1,"card-body"],[1,"bi","bi-person-circle"],[1,"card-title","mat-body-strong",2,"color","darkblue","font-size","17px"],[1,"card-text"],[1,"card","shadow",2,"width","240px","height","140px","margin-left","2%",3,"click"],[1,"bi","bi-wrench-adjustable-circle"],[1,"col-md-8",2,"font-size","20px"],[1,"bi","bi-file-earmark-medical"],[1,"card-text",2,"font-size","15px"],["src","https://cdn-icons-png.flaticon.com/512/4093/4093884.png","alt","evahaan",2,"height","23%","width","13%"],["src","https://static.vecteezy.com/system/resources/previews/014/711/297/original/id-card-isolated-on-white-background-identification-card-icon-business-identity-id-card-icon-template-badge-identification-personal-contact-in-flat-style-vector.jpg","alt","evahaan",2,"height","23%","width","17%"],[1,"card","shadow",2,"width","240px","height","140px","margin-left","2%","cursor","pointer",3,"click"],[3,"click"],["src","https://rb.nic.in/assets/img/services/car.jpg","alt","evahaan",2,"height","23%","width","17%"],[2,"text-decoration","none","color","inherit"],[1,"bi","bi-car-front"],[4,"ngIf"],[4,"ngFor","ngForOf"],["src","https://purwosari.magetan.go.id/image/admin.png","alt","admin",1,"card-img-top",2,"height","35%","width","25%","margin-top","-8%"],["src","https://rb.nic.in/assets/img/services/2.jpg","alt","eba",1,"card-img-top",2,"height","23%","width","17%"],["src","https://cdn0.iconfinder.com/data/icons/flat-profession-icons-2/48/105-1024.png","alt","eba",1,"card-img-top",2,"height","23%","width","17%"]],template:function(n,o){1&n&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2),e._uU(3," Basic Data "),e.qZA()(),e.TgZ(4,"div",1)(5,"div",3),e.NdJ("click",function(a){return o.hoverClick(a)}),e.TgZ(6,"a",4)(7,"div",5),e._UZ(8,"i",6),e.TgZ(9,"h5",7),e._uU(10,"Profile"),e.qZA(),e.TgZ(11,"p",8),e._uU(12,"Click here to View/Edit Your Profile"),e.qZA()()()(),e.TgZ(13,"div",9),e.NdJ("click",function(a){return o.hoverClick(a)}),e.TgZ(14,"a",4)(15,"div",5),e._UZ(16,"i",10),e.TgZ(17,"h5",7),e._uU(18,"Password setting"),e.qZA(),e.TgZ(19,"p",8),e._uU(20,"Click here to Change Your Password"),e.qZA()()()()(),e._UZ(21,"br")(22,"br"),e.TgZ(23,"div",1)(24,"div",11),e._uU(25," Services "),e.qZA()(),e.TgZ(26,"div",1)(27,"div",3),e.NdJ("click",function(a){return o.hoverClick(a)}),e.TgZ(28,"a",4)(29,"div",5),e._UZ(30,"i",12),e.TgZ(31,"h5",7),e._uU(32,"Applied forms"),e.qZA(),e.TgZ(33,"p",13),e._uU(34,"Click here to view your applied forms"),e.qZA()()()(),e.TgZ(35,"div",9),e.NdJ("click",function(a){return o.hoverClick(a)}),e.TgZ(36,"a",4)(37,"div",5),e._UZ(38,"img",14),e.TgZ(39,"h5",7),e._uU(40,"Apply RB Card"),e.qZA(),e.TgZ(41,"p",8),e._uU(42,"Click here to apply for Family/Domestic Help"),e.qZA()()()(),e.TgZ(43,"div",9),e.NdJ("click",function(a){return o.hoverClick(a)}),e.TgZ(44,"a",4)(45,"div",5),e._UZ(46,"img",15),e.TgZ(47,"h5",7),e._uU(48,"Apply EBA "),e.qZA(),e.TgZ(49,"p",8),e._uU(50,"Click here to apply for Family/Domestic Help"),e.qZA()()()(),e.TgZ(51,"div",16),e.NdJ("click",function(a){return o.hoverClick(a)}),e.TgZ(52,"a",17),e.NdJ("click",function(){return o.applyEvahaan()}),e.TgZ(53,"div",5),e._UZ(54,"img",18),e.TgZ(55,"h5",7),e._uU(56,"E Vaahan"),e.qZA(),e.TgZ(57,"p",8),e._uU(58,"Click here to apply for online Vehicle booking"),e.qZA()()()(),e.TgZ(59,"div",16),e.NdJ("click",function(a){return o.hoverClick(a)}),e.TgZ(60,"a",19)(61,"div",5),e._UZ(62,"i",20),e.TgZ(63,"h5",7),e._uU(64,"Parking Sticker"),e.qZA(),e.TgZ(65,"p",13),e._uU(66,"Comming Soon!!!"),e.qZA()()()()(),e._UZ(67,"br")(68,"br"),e.TgZ(69,"div",1)(70,"div",11),e._uU(71," For Office "),e.qZA()(),e.TgZ(72,"div",1),e.YNc(73,f,2,1,"ng-container",21),e.qZA()()),2&n&&(e.xp6(6),e.Q6J("routerLink","/profile/view"),e.xp6(8),e.Q6J("routerLink","/change-password"),e.xp6(14),e.Q6J("routerLink","/ebaformlist"),e.xp6(8),e.Q6J("routerLink","/eba-form/edit/relative/view"),e.xp6(8),e.Q6J("routerLink","/eba-form/edit/relative/view"),e.xp6(29),e.Q6J("ngIf",o.user&&o.user.role))},dependencies:[l.sg,l.O5,d.rH],styles:['.card-container[_ngcontent-%COMP%]{position:relative;overflow:hidden}.card[_ngcontent-%COMP%]:hover{box-shadow:10px 10px 10px #000000b3;transform:scale(1.12);transition:transform .3s ease,box-shadow .3s ease;background-image:linear-gradient(to bottom right,#f3ddba,transparent),url("R (1).c7b6692d8f160d3c.png");background-size:auto,64vh;background-position:center,left bottom;background-repeat:no-repeat}.card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:hover{transform:scale(1.07)}.card.clicked[_ngcontent-%COMP%]{box-shadow:none;transform:scale(.9)}.card[_ngcontent-%COMP%]{background-image:url(https://www.clipartmax.com/png/small/44-446497_lines-clipart-vertical-line-blue-vertical-line-png.png),url(https://www.clipartmax.com/png/small/44-446497_lines-clipart-vertical-line-blue-vertical-line-png.png),linear-gradient(to bottom right,#e6e6fa,linen);background-repeat:no-repeat,no-repeat,no-repeat;background-position:right top,right 5px top,center;background-size:.7vh,.7vh,auto;width:240px;height:140px;margin-left:2%;cursor:pointer}.nav-link[_ngcontent-%COMP%]:hover{color:#00f}']})}return t})()}];let b=(()=>{class t{static#e=this.\u0275fac=function(n){return new(n||t)};static#i=this.\u0275mod=e.oAB({type:t});static#t=this.\u0275inj=e.cJS({imports:[d.Bz.forChild(Z),d.Bz]})}return t})(),k=(()=>{class t{static#e=this.\u0275fac=function(n){return new(n||t)};static#i=this.\u0275mod=e.oAB({type:t});static#t=this.\u0275inj=e.cJS({imports:[l.ez,b]})}return t})()}}]);