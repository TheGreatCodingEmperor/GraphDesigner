import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { DatasetEditorComponent } from '../../components/dialog/dataset-editor/dataset-editor.component';
import { DataSetEditUI, IDataSetEditUI } from '../../models/dataset-editor';
import { DatasetListItem, IDatasetListItem } from '../../models/dataset-manager';
import { DatasetEditorService } from '../../services/dataset-editor.service';
import { DatasetManagerService } from '../../services/dataset-manager.service';

@Component({
  selector: 'app-dataset-manager',
  templateUrl: './dataset-manager.component.html',
  styleUrls: ['./dataset-manager.component.css']
})
export class DatasetManagerComponent implements AfterViewInit {

  dataColumns: string[] = ['DataSetName', 'DataType'];
  displayedColumns: string[] = ['DataSetName', 'DataType', 'React'];

  dataSource = new MatTableDataSource<IDatasetListItem>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private datasetManagerService: DatasetManagerService,
    private dataSetEditorService: DatasetEditorService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngAfterViewInit() {
    this.GetProjectList();
    this.dataSource.paginator = this.paginator;
  }

  GetProjectList() {
    this.datasetManagerService.GetDataSetMangerList().subscribe((res: DatasetListItem[]) => {
      this.dataSource = new MatTableDataSource<IDatasetListItem>(res);
    })
  }

  editDataSet(dataSetId?: string | number) {
    if (dataSetId) {
      let spinnerRef = this.dialog.open(ProgressSpinnerComponent, {
        width: '150px',
        height: '150px',
        data: null
      });

      this.dataSetEditorService.GetDataSetEdit(dataSetId).subscribe((res: IDataSetEditUI) => {
        spinnerRef.close();
        this.openDialog(res);
      }, error => {
        this.openSnackBar(error.message);
      });
    }
    else {
      this.openDialog(new DataSetEditUI);
    }
  }

  openDialog(datset: IDataSetEditUI) {
    const dialogRef = this.dialog.open(DatasetEditorComponent, {
      width: '50vw',
      data: datset
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.GetProjectList();
      }
    });
  }

  // openDialog(dataSetId?: string | number): void {
  //   if (dataSetId) {
  //     this.dataSetEditorService.GetDataSetEdit(dataSetId).subscribe((res: IDataSetEditUI) => {
  //       const dialogRef = this.dialog.open(DatasetEditorComponent, {
  //         width: '50vw',
  //         data: res
  //       });

  //       dialogRef.afterClosed().subscribe(result => {
  //         console.log('The dialog was closed');
  //         if (result) {
  //           this.GetProjectList();
  //         }
  //       });
  //     }, error => {
  //       this.openSnackBar(error.message);
  //     });
  //   }
  //   else {
  //     const dialogRef = this.dialog.open(DatasetEditorComponent, {
  //       width: '50vw',
  //       data: new DataSetEditUI
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //       if (result) {
  //         this.GetProjectList();
  //       }
  //     });
  //   }
  // }


  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
