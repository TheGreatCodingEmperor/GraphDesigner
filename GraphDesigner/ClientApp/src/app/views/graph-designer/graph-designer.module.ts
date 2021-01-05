import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphDesignerRoutingModule } from './graph-designer-routing.module';
import { ProjectManagerComponent } from './view/project-manager/project-manager.component';
import { SharedModule } from 'src/app/modules/shared-module';
import { DatasetManagerComponent } from './view/dataset-manager/dataset-manager.component';
import { JoinDesignerComponent } from './view/join-designer/join-designer.component';
import { ProjectEditorComponent } from './components/dialog/project-editor/project-editor.component';
import { DatasetEditorComponent } from './components/dialog/dataset-editor/dataset-editor.component';
import { MapDesignerComponent } from './view/map-designer/map-designer.component';
import { JoinResultComponent } from './components/dialog/join-result/join-result.component';


@NgModule({
  declarations: [
    ProjectManagerComponent, 
    DatasetManagerComponent, 
    JoinDesignerComponent, 
    ProjectEditorComponent, 
    DatasetEditorComponent, 
    MapDesignerComponent, 
    JoinResultComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GraphDesignerRoutingModule
  ],
  entryComponents:[
    ProjectEditorComponent,
    DatasetEditorComponent,
    JoinResultComponent
  ]
})
export class GraphDesignerModule { }
