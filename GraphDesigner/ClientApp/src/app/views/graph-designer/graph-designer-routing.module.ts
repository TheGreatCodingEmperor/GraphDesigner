import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasetManagerComponent } from './view/dataset-manager/dataset-manager.component';
import { JoinDesignerComponent } from './view/join-designer/join-designer.component';
import { MapDesignerComponent } from './view/map-designer/map-designer.component';
import { ProjectManagerComponent } from './view/project-manager/project-manager.component';


const routes: Routes = [{
  path: 'project', children: [
    { path: 'manager', component: ProjectManagerComponent }
  ]
},
{
  path: 'dataset', children: [
    { path: 'manager', component: DatasetManagerComponent }
  ]
}, 
{ path: 'map', component: MapDesignerComponent },
{ path: 'join', component: JoinDesignerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphDesignerRoutingModule { }
