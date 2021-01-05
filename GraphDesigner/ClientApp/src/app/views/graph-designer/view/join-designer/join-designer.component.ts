import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { JqueryFlochartHelper } from 'src/app/helpers/jquery-flowchart-helper';
import { JoinResultComponent } from '../../components/dialog/join-result/join-result.component';
import { IJoinTableSelectOption, ILayerMainTableOptions } from '../../models/join-designer';
import { JoinDesignerService } from '../../services/join-designer.service';
declare var $: any;

@Component({
  selector: 'app-join-designer',
  templateUrl: './join-designer.component.html',
  styleUrls: ['./join-designer.component.css']
})
export class JoinDesignerComponent implements AfterViewInit {

  cx = 500;
  cy = 500;
  layerTableOptions:ILayerMainTableOptions[] = [];
  displayTables = [];
  tables = [];
  table:IJoinTableSelectOption = null;
  projectId = 0;
  MainTableId = 0;
  topoList = [];
  LayerName = '';


  @ViewChild('exampleDiv', { static: true }) exampleDiv: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private joinDesignerService: JoinDesignerService,
    private jqueryFlowchartHelper: JqueryFlochartHelper,
    private _snackBar: MatSnackBar
  ) {
  }

  ngAfterViewInit() {
    this.projectId = Number(this.route.snapshot.queryParamMap.get('ProjectId'));
    this.jqueryFlowchartInit();
    this.GetJoinDataSetSchemas();
    this.GetLayerMaintableSelectOptions();
  }

  /** @summary 取得 右側可拖曳 table */
  GetJoinDataSetSchemas(){
    this.joinDesignerService.GetJoinDataSetSchemas(this.projectId).subscribe((res: IJoinTableSelectOption[]) => {
      this.tables = res;
      this.displayTables = res;
    }, error => {
      this.openSnackBar(error.message);
    })
  }

  /** @summary 取得 Layer 主表 資訊 */
  GetLayerMaintableSelectOptions(){
    this.joinDesignerService.GetLayerMaintableSelectOptions(this.projectId).subscribe((res: ILayerMainTableOptions[]) => {
      this.layerTableOptions = res;
    }, error => {
      this.openSnackBar(error.message);
    })
  }

  /** @summary 拖曳起始紀錄拖曳物件 */
  dragstart(table: any, index: number) {
    this.table = table;
  }

  /** @summary 拖曳 */
  dragover(ev) {
    ev.preventDefault();
  }

  /** @summary 拖曳結束 build UI table */
  drop(ev) {
    console.log(ev.pageX);
    console.log(ev);
    this.jqueryFlowchartHelper.AddOperator($(this.exampleDiv.nativeElement), this.table.TableId, this.table.TableName, ev.offsetX, ev.offsetY, this.table.Schema);
  }

  remove(){
    this.jqueryFlowchartHelper.Delete($(this.exampleDiv.nativeElement));
  }

  getDatas(){
    let datas = this.jqueryFlowchartHelper.GetDatas($(this.exampleDiv.nativeElement));
    console.log(datas);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

   /** 開啟 projectEditor 彈跳視窗 */
   openDialog(data?:any) {
    const dialogRef = this.dialog.open(JoinResultComponent, {
      width: '50vw',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
      }
    });
  }

  addLayer(){
    
  }

  joinResult(){
    this.openDialog('hello');
  }

  //#region  封裝
  jqueryFlowchartInit() {
    var container = $('#chart_container');
    this.cx = $('#exampleDiv').width() / 2;
    this.cy = $('#exampleDiv').height() / 2;
    $('#exampleDiv').panzoom({
    });
    $('#exampleDiv').panzoom('pan', -this.cx + container.width() / 2, -this.cy + container.height() / 2);

    var possibleZooms = [0.5, 0.75, 1, 2, 3];
    var currentZoom = 2;
    container.on('mousewheel.focal', function (e) {
      e.preventDefault();
      var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
      var zoomOut: any = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
      $('#exampleDiv').flowchart('setPositionRatio', possibleZooms[currentZoom]);
      $('#exampleDiv').panzoom('zoom', possibleZooms[currentZoom], {
        animate: false,
        focal: e
      });
    });


    setTimeout(() => {
      $(this.exampleDiv.nativeElement).flowchart({
        data: '',
        multipleLinksOnOutput: false,
      });
      $(".flowchart-links-layer").on("dragover", (e) => this.dragover(e));
      $(".flowchart-links-layer").on("drop", (e) => this.drop(e));
    }, 1000);

  }
  //#endregion 封裝
}

