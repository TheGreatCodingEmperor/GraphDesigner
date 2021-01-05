import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JoinResultService } from '../../../services/join-result.service';

@Component({
  selector: 'app-join-result',
  templateUrl: './join-result.component.html',
  styleUrls: ['./join-result.component.css']
})
export class JoinResultComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JoinResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private joinResultService: JoinResultService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
