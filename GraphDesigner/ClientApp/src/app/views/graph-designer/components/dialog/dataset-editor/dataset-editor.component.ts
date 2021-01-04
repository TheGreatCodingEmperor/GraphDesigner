import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import * as t from "topojson";
import { DataSetEditDB, IDataSetEditDB, IDataSetEditUI } from '../../../models/dataset-editor';
import { DatasetEditorService } from '../../../services/dataset-editor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dataset-editor',
  templateUrl: './dataset-editor.component.html',
  styleUrls: ['./dataset-editor.component.css']
})
export class DatasetEditorComponent implements OnInit {
  public importExcel = {};
  importJson = null;
  dataPages = [];
  jsonText = "";

  constructor(public dialogRef: MatDialogRef<DatasetEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDataSetEditUI,
    private dataSetEditorService: DatasetEditorService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    if(this.data.DataType !=0 && this.data.Data){
      this.jsonText = JSON.stringify(this.data.Data).slice(0, 300).concat("...");
    }
  }

  onFileChange(ev) {
    if (this.data.DataType == 0) {
      this.openExcel(ev);
    }
    else if (this.data.DataType == 1 || this.data.DataType == 2) {
      this.openJson(ev);
    }
  }

  openExcel(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      this.importExcel = jsonData;
      console.log(jsonData);
      this.dataPages = Object.keys(jsonData);
    }
    reader.readAsBinaryString(file);
  }

  openJson(ev) {
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result as string;
      this.importJson = data;
      this.jsonText = data.slice(0, 300).concat("...");
      // console.log(data);
    }
    reader.readAsBinaryString(file);
  }

  handleChange(event) {
    this.data.Schema = Object.keys(this.data.Data[0]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    let datasetEditDb: IDataSetEditDB = new DataSetEditDB;
    let schema = null;
    let data = null;
    if(this.data.DataType == 0){
      schema = this.data.Schema.join(',');
      data = JSON.stringify(this.data.Data);
    }
    else if(this.data.DataType == 1 || this.data.DataType == 2){
      schema = null;
      data = JSON.stringify(JSON.parse(this.importJson));
    }
    datasetEditDb = {
      DataSetId: this.data.DataSetId,
      DataSetName: this.data.DataSetName,
      DataType: this.data.DataType,
      Schema: schema,
      Data: data
    }
    console.log(datasetEditDb);
    this.dataSetEditorService.SaveDataSetEdit(datasetEditDb).subscribe((res:object)=>{
      this.openSnackBar("Save Successful!");
      this.dialogRef.close("yes");
    },error=>{
      this.openSnackBar("Save Failed!");
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
