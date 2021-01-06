import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { JoinDesignHelper } from 'src/app/helpers/join-design-helper';
import { JqueryFlochartHelper } from 'src/app/helpers/jquery-flowchart-helper';
import { JoinResultComponent } from '../../components/dialog/join-result/join-result.component';
import { IJoinDesignLayer, IJoinTableSelectOption, ILayerMainTableOptions, JoinDesignLayer, JoinDesignLine, JoinDesignTable, Layer } from '../../models/join-designer';
import { JoinDesignerService } from '../../services/join-designer.service';
import { JoinResultService } from '../../services/join-result.service';
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

  schemaOptions:string[] = [];
  objectOptions:string[] = [];
  dataType = 0;

  /** @summary 專案邊號 */
  projectId = 0;

  layers: IJoinDesignLayer[] = [];
  /** @summary 當前 layer */
  currentLayer: IJoinDesignLayer = null;
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
    private joinResultService: JoinResultService,
    private jqueryFlowchartHelper: JqueryFlochartHelper,
    private joinDesignHelper: JoinDesignHelper,
    private _snackBar: MatSnackBar
  ) {
  }

  ngAfterViewInit() {
    this.projectId = Number(this.route.snapshot.queryParamMap.get('ProjectId'));
    //join design drag options
    this.GetJoinDesignDragOptions();
    //get layer maintable options
    this.GetLayerMaintableSelectOptions();
    //get layers
    this.GetJoinDesignLayers();
  }

  /** @summary get layers、draw layer joinDesign */
  GetJoinDesignLayers() {
    const dialogRef = this.dialog.open(ProgressSpinnerComponent, {
      width: '150px',
      height: '150px'
    });
    this.joinDesignerService.GetJoinDesignLayers(this.projectId).subscribe((res: IJoinDesignLayer[]) => {
      dialogRef.close();
      this.layers = res;
      for (let layer of this.layers) {
        layer.Layer.Design = this.joinDesignHelper.ConvertAPIClass2FlowChart(layer.Lines, layer.Tables);
      }
      this.currentLayer = res [0];
      //flow chart init
      this.jqueryFlowchartInit();
      console.log(this.layers)
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
        if (this.currentLayer.Layer.ObjectType != null) {
          this.schemaOptions = table.Schema[this.currentLayer.Layer.ObjectType];
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
        this.currentLayer.Layer.ObjectType = null;
        this.schemaOptions = table.Schema as string[];
      }
      case 1: {
        // this.currentLayer.Layer.LatitudeColName = null;
        // this.currentLayer.Layer.LongitudeColName = null;
        this.objectOptions = Object.keys(table.Schema);
        if (this.currentLayer.Layer.ObjectType != null) {
          this.schemaOptions = table.Schema[this.currentLayer.Layer.ObjectType];
        }
        break;
      }
      default: { break; }
    }
  }

  /** @summary Layer 改變 */
  tabChange(e) {
    //儲存上一個 layer 到到暫存(layer.Design)
    this.lastLayer = this.currentLayer;
    if (this.lastLayer) {
      this.lastLayer.Layer.Design = this.getDatas();
    }
    //this.layer 紀錄當前 Layer 資訊
    this.currentLayer = this.layers[e.index];
    console.log(this.currentLayer);

    //this layer mainTable type
    let table = this.mainTableOptions.find(x => x.TableId == this.currentLayer.Layer.MainTableId);
    if (table) this.dataType = table.DataType;

    //取得主表欄位選項/行政區階層
    this.getObjectOptions(table);
    if (!this.block) {
      if (this.currentLayer.Layer.Design)
        this.jqueryFlowchartHelper.SetDatas($(this.exampleDiv.nativeElement), this.currentLayer.Layer.Design);
      else
        this.jqueryFlowchartHelper.SetDatas($(this.exampleDiv.nativeElement), {});
    }
  }

  /** @summary 行政區 層級改變 */
  objectChange(e) {
    var table = this.mainTableOptions.find(x => x.TableId == this.currentLayer.Layer.MainTableId);
    this.dataType = table.DataType;
    this.getSchemaOptions(table);
  }

  /** @summary Layer 主表改變 */
  onMainTableChange(e) {
    var table = this.mainTableOptions.find(x => x.TableId == this.currentLayer.Layer.MainTableId);
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

  /** @summary 移除 UI Table 或 線條 */
  remove() {
    this.jqueryFlowchartHelper.Delete($(this.exampleDiv.nativeElement));
  }

  /** @summary 除錯 UI Designe 結果 */
  getDatas() {
    let datas = this.jqueryFlowchartHelper.GetDatas($(this.exampleDiv.nativeElement));
    this.currentLayer.Layer.Design = datas;
    console.log(this.layers);
    return datas;
  }

  /** @summary 儲存 UI Design 結果 */
  saveLinesAndTables() {
    this.currentLayer.Layer.Design = this.getDatas();
    // let datas = this.jqueryFlowchartHelper.GetDatas($(this.exampleDiv.nativeElement));
    // this.joinDesignHelper.ConvertFlowChart2APIClass(datas);
    let result = [];
    for (let layer of this.layers) {
      let data = this.joinDesignHelper.ConvertFlowChart2APIClass(layer.Layer.Design);
      let tmp = {};
      tmp['layer'] = layer.Layer;
      delete tmp['layer'].Design;
      tmp['tables'] = data.tables;
      tmp['lines'] = data.lines;
      result.push(tmp);
    }
    console.log(result);
    this.joinDesignerService.SaveJoinDesign(this.projectId, result).subscribe(res => {
      this.openSnackBar("Save Seccessful!");
      this.GetJoinDesignLayers();
    }, error => { this.openSnackBar(error.message) });
  }

  /** @summary API 結果 彈掉視窗 */
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

  /** 開啟 projectEditor 彈跳視窗 */
  openDialog(data?: {Tables:object[],Data:any[]}) {
    data['schemaOptions'] = this.schemaOptions;
    data['JoinPkTableId'] = this.currentLayer.Layer.JoinPkTableId;
    data['PkColName'] = this.currentLayer.Layer.PkColName;
    data['JoinPkName'] = this.currentLayer.Layer.JoinPkName;
    const dialogRef = this.dialog.open(JoinResultComponent, {
      width: '80vw',
      height: '90vh',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.currentLayer.Layer.PkColName = result.PkColName;
        this.currentLayer.Layer.JoinPkName = result.JoinPkName;
        this.currentLayer.Layer.JoinPkTableId = result.JoinPkTableId;
      }
    });
  }

  /** @summary 新增一層圖 */
  addLayer() {
    let tmp = new JoinDesignLayer;
    tmp.Layer.ProjectId = this.projectId;
    this.layers.push(tmp);
  }

  /** @summary 建立 join 結果與 main table 關係 */
  joinResult() {
    var datas = this.joinDesignHelper.ConvertFlowChart2APIClass(this.currentLayer.Layer.Design);
    this.joinResultService.DataSetInnerJoin({ projectId: this.projectId, lines: datas.lines }).subscribe((res:{Tables:object[],Data:any[]}) => {
      console.log(res);
      this.openDialog(res);
    }, error => {
      this.openSnackBar("Join Successed!");
    });
  }

  hasForeignKey(){
    if(this.block)return true;
    return this.currentLayer.Layer.JoinPkTableId&&this.currentLayer.Layer.JoinPkName&&this.currentLayer.Layer.PkColName;
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


    // setTimeout(() => {
    $(this.exampleDiv.nativeElement).flowchart({
      data: this.currentLayer.Layer.Design,
      multipleLinksOnOutput: false,
    });
    $(".flowchart-links-layer").on("dragover", (e) => this.dragover(e));
    $(".flowchart-links-layer").on("drop", (e) => this.drop(e));
    this.block = false;
    // }, 1000);

  }
  //#endregion 封裝
}

