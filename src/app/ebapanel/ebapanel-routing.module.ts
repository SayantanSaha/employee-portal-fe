import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EbapanelComponent} from "../ebapanel/ebapanel.component";

const routes: Routes = [
    { path: '', component: EbapanelComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EbapanelRoutingModule { }
