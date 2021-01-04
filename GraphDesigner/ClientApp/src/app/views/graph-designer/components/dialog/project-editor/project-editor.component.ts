import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectItem } from 'src/app/models/select-item';
import { IProjectEditUI, ProjectEditDB } from '../../../models/project-editor';
import { ProjectEditorService } from '../../../services/project-editor.service';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.css']
})
export class ProjectEditorComponent implements OnInit {
  topoList = [];

  constructor(public dialogRef: MatDialogRef<ProjectEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: IProjectEditUI, dataSetList: any[] },
    private projectEditorService: ProjectEditorService,
    private _snackBar: MatSnackBar) { 
      this.topoList = this.data.dataSetList.filter(x => x.type == 1);
    }

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
  onYesClick() {
    let projectEditDb = new ProjectEditDB;
    let design = '';
    switch (this.data.project.ProjectType) {
      case 1: {
        if (this.data.project.Design == null) {
          design = JSON.stringify((new DefaultDesign).map);
        } else {
          design = this.data.project.Design;
        }
        break;
      }
      default: {
        design = this.data.project.Design;
        break;
      }
    }
    projectEditDb = {
      ProjectId: this.data.project.ProjectId,
      ProjectName: this.data.project.ProjectName,
      MainTableId: this.data.project.MainTableId,
      ProjectType: this.data.project.ProjectType,
      Design: design
    }
    console.log(projectEditDb);
    console.log(this.data.project.ProjectDataIds);
    this.projectEditorService.SaveProjectEdit({project:projectEditDb,projectDataIds:this.data.project.ProjectDataIds}).subscribe(
      res=>{
        console.log(res);
        this.openSnackBar("Save Successed!");
      },
      error=>{
        this.openSnackBar(error.message);
      }
    )
    // this.dialogRef.close();
  }
}

export class DefaultDesign {
  map = [];
}