import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { SelectItem } from 'src/app/models/select-item';
import { ProjectEditorComponent } from '../../components/dialog/project-editor/project-editor.component';
import { IProjectEditUI, ProjectEditUI } from '../../models/project-editor';
import { IProjectManagerListItem, ProjectManagerListItem } from '../../models/project-manager';
import { ProjectEditorService } from '../../services/project-editor.service';
import { ProjectManagerService } from '../../services/project-manager.service';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.css']
})
export class ProjectManagerComponent implements AfterViewInit {

  dataColumns: string[] = ['ProjectName', 'ProjectType'];
  displayedColumns: string[] = ['ProjectName', 'ProjectType', 'React'];

  dataSource = new MatTableDataSource<IProjectManagerListItem>([]);
  dataSetList: any[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private projectManagerService: ProjectManagerService,
    private projectEditorService: ProjectEditorService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.GetProjectList();
    this.GetDataSetList();
    this.dataSource.paginator = this.paginator;
  }

  /** @summary 取得資料集 下拉清單 */
  GetDataSetList() {
    this.projectManagerService.GetDatasetList().subscribe(
      (res: { Label: string, Value: any, Type: number }[]) => {
        this.dataSetList = res.map(x => { return { label: x.Label, value: x.Value, type: x.Type } });
      }
    );
  }

  /** @summary 取得 project 清單 */
  GetProjectList() {
    this.projectManagerService.GetProjectList().subscribe((res: ProjectManagerListItem[]) => {
      this.dataSource = new MatTableDataSource<IProjectManagerListItem>(res);
    })
  }

  /** @summary 彈跳視窗 編輯 project 屬性 */
  editProject(projectId: string | number) {
    if (projectId) {
      const spinnerRef = this.dialog.open(ProgressSpinnerComponent, {
        width: '150px',
        height: '150px'
      });
      this.projectEditorService.GetDataSetEdit(projectId).subscribe(
        (res:IProjectEditUI)=>{
          spinnerRef.close();
          this.openDialog(res);
        },error=>{
          this.openSnackBar(error.message);
        }
      )
    }
    else {
      this.openDialog(new ProjectEditUI);
    }
  }

  /** 開啟 projectEditor 彈跳視窗 */
  openDialog(project: IProjectEditUI) {
    const dialogRef = this.dialog.open(ProjectEditorComponent, {
      width: '50vw',
      data: { project: project, dataSetList: this.dataSetList }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.GetProjectList();
      }
    });
  }

  /** @summary API 結果彈跳視窗 */
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

  gotoJoin(projectId:number){
    this.router.navigate([''],{queryParams:{ProjectId: projectId}});
  }
}
