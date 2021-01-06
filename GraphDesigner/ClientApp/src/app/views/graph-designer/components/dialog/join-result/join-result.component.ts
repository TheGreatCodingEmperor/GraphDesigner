import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JoinResultService } from '../../../services/join-result.service';

@Component({
  selector: 'app-join-result',
  templateUrl: './join-result.component.html',
  styleUrls: ['./join-result.component.css']
})
export class JoinResultComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataColumns: string[] = ['ProjectName', 'ProjectType'];
  displayedColumns: string[] = ['ProjectName', 'ProjectType', 'React'];
  dataSource = new MatTableDataSource<any>([]);

  tables:{id:number,name:string,cols:string[]}[] = [];

  mainColOptions = ["townId","townName","countyid","countyname"];

  constructor(
    public dialogRef: MatDialogRef<JoinResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  {
      Tables:any[],
      Data:any[],
      schemaOptions:string[],
      PkColName:string,
      JoinPkName:string,
      JoinPkTableId:number
    },
    private joinResultService: JoinResultService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log("dialog");
    console.log(this.data.Data);
    let tables = Object.keys(this.data.Data[0]);
    this.tables = tables.map(x => {
      return {
        id:this.data.Tables.find(i => i.Name == x).Id,
        name:x,
        cols:Object.keys(this.data.Data[0][x])
      }
    });
  }

  foreighKey(table:{id:number,name:string,cols:string[]},col:string,mainCol:string){
    console.log(table,col,mainCol);
    this.data.PkColName = mainCol;
    this.data.JoinPkName = col;
    this.data.JoinPkTableId = table.id;
  }

  isForeignKey(tableId:number,col:string){
    return this.data.JoinPkTableId == tableId && this.data.JoinPkName == col;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

  onYesClick(){
    this.dialogRef.close(
      {
        PkColName:this.data.PkColName,
        JoinPkName:this.data.JoinPkName,
        JoinPkTableId:this.data.JoinPkTableId
      }
    )
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
