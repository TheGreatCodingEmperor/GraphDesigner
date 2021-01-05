import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { JqueryFlochartHelper } from 'src/app/helpers/jquery-flowchart-helper';
import { JoinResultComponent } from '../../components/dialog/join-result/join-result.component';
import { IJoinDesignLayer, IJoinTableSelectOption, ILayerMainTableOptions, JoinDesignLayer, JoinDesignLine, JoinDesignTable, Layer } from '../../models/join-designer';
import { JoinDesignerService } from '../../services/join-designer.service';
declare var $: any;

@Component({
  selector: 'app-join-designer',
  templateUrl: './join-designer.component.html',
  styleUrls: ['./join-designer.component.css']
})
export class JoinDesignerComponent implements AfterViewInit {

  /** @summary 寬 */
  cx = 500;
  /** @summary 長 */
  cy = 500;
  /** @summary 主table下拉選單 */
  mainTableOptions: ILayerMainTableOptions[] = [];
  /** @summary 右側bar 可拖曳Table選項*/
  displayTables = [];
  /** @summary project tables */
  tables = [];
  /** @summary 正在 drap Table */
  table: IJoinTableSelectOption = null;

  schemaOptions = [];
  objectOptions = [];
  dataType = 0;

  /** @summary 專案邊號 */
  projectId = 0;

  layers: IJoinDesignLayer[] = [];
  /** @summary 當前 layer */
  layer: IJoinDesignLayer = null;
  lastLayer: IJoinDesignLayer = null;
  block = true;

  /** @summary Layer 主 Table 編號 */
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
    //flow chart init
    this.jqueryFlowchartInit();
    //join design drag options
    this.GetJoinDesignDragOptions();
    //get layer maintable options
    this.GetLayerMaintableSelectOptions();
    //get layers
    this.GetJoinDesignLayers();
  }

  /** @summary get layers */
  GetJoinDesignLayers() {
    const dialogRef = this.dialog.open(ProgressSpinnerComponent, {
      width: '150px',
      height: '150px'
    });
    this.joinDesignerService.GetJoinDesignLayers(this.projectId).subscribe((res: IJoinDesignLayer[]) => {
      dialogRef.close();
      this.layers = res;
    }, error => {
      this.openSnackBar(error.message);
    });
  }

  /** @summary 取得 右側可拖曳 table */
  GetJoinDesignDragOptions() {
    this.joinDesignerService.GetJoinDesignDragOptions(this.projectId).subscribe((res: IJoinTableSelectOption[]) => {
      this.tables = res;
      this.displayTables = res;
    }, error => {
      this.openSnackBar(error.message);
    })
  }

  /** @summary 取得 Layer 主表 下拉清單選項 */
  GetLayerMaintableSelectOptions() {
    this.joinDesignerService.GetLayerMaintableSelectOptions(this.projectId).subscribe((res: ILayerMainTableOptions[]) => {
      this.mainTableOptions = res;
    }, error => {
      this.openSnackBar(error.message);
    })
  }

  /** @summary 取得主表欄位選項 */
  getSchemaOptions(table?: ILayerMainTableOptions) {
    this.schemaOptions = []
    if (!table) return;
    switch (table.DataType) {
      case 0: {
        this.schemaOptions = table.Schema as string[];
      }
      case 1: {
        if (this.layer.Layer.ObjectType != null) {
          this.schemaOptions = table.Schema[this.layer.Layer.ObjectType];
        }
        break;
      }
      default: { break; }
    }
  }

  /** @summary 取得行政區層級、欄位選項 */
  getObjectOptions(table?: ILayerMainTableOptions) {
    this.schemaOptions = []
    this.objectOptions = []
    if (!table) return;
    switch (table.DataType) {
      case 0: {
        this.layer.Layer.ObjectType = null;
        this.schemaOptions = table.Schema as string[];
      }
      case 1: {
        this.layer.Layer.LatitudeColName = null;
        this.layer.Layer.LongitudeColName = null;
        this.objectOptions = Object.keys(table.Schema);
        if (this.layer.Layer.ObjectType != null) {
          this.schemaOptions = table.Schema[this.layer.Layer.ObjectType];
        }
        break;
      }
      default: { break; }
    }
  }

  /** @summary Layer 改變 */
  tabChange(e) {
    this.lastLayer = this.layer;
    if (this.lastLayer) {
      console.log('last layer')
      console.log(this.lastLayer);
      this.lastLayer.Layer.Design = this.getDatas();
    }
    this.layer = this.layers[e.index];
    let table = this.mainTableOptions.find(x => x.TableId == this.layer.Layer.MainTableId);
    if (table) this.dataType = table.DataType;
    this.getObjectOptions(table);
    if (!this.block) {
      if (this.layer.Layer.Design)
        this.jqueryFlowchartHelper.SetDatas($(this.exampleDiv.nativeElement), this.layer.Layer.Design);
      else
        this.jqueryFlowchartHelper.SetDatas($(this.exampleDiv.nativeElement), {});
    }
  }

  /** @summary 行政區 層級改變 */
  objectChange(e) {
    var table = this.mainTableOptions.find(x => x.TableId == this.layer.Layer.MainTableId);
    this.dataType = table.DataType;
    this.getSchemaOptions(table);
  }

  /** @summary Layer 主表改變 */
  onMainTableChange(e) {
    var table = this.mainTableOptions.find(x => x.TableId == this.layer.Layer.MainTableId);
    this.dataType = table.DataType;
    this.getObjectOptions(table);
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

  remove() {
    this.jqueryFlowchartHelper.Delete($(this.exampleDiv.nativeElement));
  }

  getDatas() {
    let datas = this.jqueryFlowchartHelper.GetDatas($(this.exampleDiv.nativeElement));
    this.layer.Layer.Design = datas;
    console.log(this.layers);
    return datas;
  }

  saveLinesAndTables() {
    let datas = this.jqueryFlowchartHelper.GetDatas($(this.exampleDiv.nativeElement));
    // console.log(datas)
    let lines: any[] = [];
    let tables: { tableId: number, top: number, left: number }[] = [];
    let linksIds = Object.keys(datas.links);
    for (let line of linksIds) {
      let tmp: any = {};
      // tmp.MapId = this.mapId;
      tmp.fromTableId = Number(datas.links[line as string].fromOperator);
      tmp.fromColName = datas.links[line as string].fromConnector.split('_')[0];
      tmp.toTableId = Number(datas.links[line as string].toOperator);
      tmp.toColName = datas.links[line as string].toConnector.split('_')[0];
      lines.push(tmp);
    }
    let operatorIds = Object(datas.operators);
    for (let table in operatorIds) {
      tables.push({
        tableId: Number(table),
        left: datas.operators[table as string].left,
        top: datas.operators[table as string].top
      })
    }
    console.log({ lines: lines, tables: tables })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

  /** 開啟 projectEditor 彈跳視窗 */
  openDialog(data?: any) {
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

  addLayer() {
    this.layers.push(new JoinDesignLayer);
  }

  joinResult() {
    this.openDialog('hello');
  }

  //#region  封裝
  /** @summary jquery flow chart 初始 */
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
      this.block = false;
    }, 1000);

  }
  //#endregion 封裝
}

