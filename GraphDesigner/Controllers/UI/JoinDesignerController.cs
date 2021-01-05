using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using GraphDesigner.Helpers;
using GraphDesigner.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace GraphDesigner.Controllers {
    [ApiController]
    [Route ("UI/[controller]")]
    public class JoinDesignerController : UIBaseController<GraphDesignerContext> {
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public JoinDesignerController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper) : base (context, efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet ("GetJoinDesignDragOptions/{Id}")]
        /// <summary>
        /// Join design UI drag 選項清單
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public async Task<IActionResult> GetJoinDesignDragOptions ([FromRoute] int Id) {
            try {
                //join projectdata、dataset
                var projectDatasets = _efCoreHelper.GetList<ProjectDatas> (_context).Where (x => x.ProjectId == Id);
                var tableDatasets = _efCoreHelper.GetList<DataSet> (_context).Where (x => x.DataType == 0);
                var query = from projectData in projectDatasets
                join dataset in tableDatasets
                on projectData.DataSetId equals dataset.DataSetId
                select new {
                    TableId = projectData.ProjectDataId,
                    TableName = dataset.DataSetName,
                    Schema = dataset.Schema
                };
                var result = new List<dynamic> ();
                foreach (var item in query) {
                    var tmp = new {
                        TableId = item.TableId,
                        TableName = item.TableName,
                        Schema = string.IsNullOrEmpty (item.Schema) ? new string[0] : item.Schema.Split (',')
                    };
                    result.Add (tmp);
                }
                await Task.CompletedTask;
                return Ok (JsonConvert.SerializeObject (result, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }

        [HttpGet ("GetJoinDesignLayers/{ProjectId}")]
        /// <summary>
        /// 取得 join design 所需資料(UI Tabs)
        /// </summary>
        /// <param name="ProjectId">Project 編號</param>
        /// <returns></returns>
        public async Task<IActionResult> GetJoinDesignLayers ([FromRoute] int ProjectId) {
            // Project 主表(地圖)
            var projectMainTable = _efCoreHelper.GetList<ProjectDatas> (_context).Where (x => x.ProjectId == ProjectId).SingleOrDefault (x => x.IsProjectMainTable == true);
            var projectMainTableInfo = _efCoreHelper.GetList<DataSet> (_context).SingleOrDefault (x => x.DataSetId == projectMainTable.DataSetId);

            //層
            var layers = _efCoreHelper.GetList<Layer> (_context).Where (x => x.ProjectId == ProjectId).ToList ();
            
            //資料集
            var datasets = _efCoreHelper.GetList<DataSet> (_context).Where (x => x.DataType == 0);
            //project、資料集關係
            var projectDatas = _efCoreHelper.GetList<ProjectDatas> (_context).Where (x => x.ProjectId == ProjectId);
            //UI Tables
            var projectTables = _efCoreHelper.GetList<JoinTables> (_context).Where (x => x.ProjectId == ProjectId);

            var projectLines = _efCoreHelper.GetList<JoinLines> (_context).Where (x => x.ProjectId == ProjectId).ToList ();

            // project table join ui table 欄位
            var uiTables = from projectTable in projectTables
            join projectData in projectDatas
            on projectTable.ProjectDataId equals projectData.ProjectDataId
            join dataSet in datasets
            on projectData.DataSetId equals dataSet.DataSetId
            select new {
                ProjectDataId = projectData.ProjectDataId,
                Name = dataSet.DataSetName,
                Schema = dataSet.Schema,
                LayerId = projectTable.LayerId
            };

            // project line join ui line 欄位
            var uiLines = new List<dynamic> ();
            foreach (var line in projectLines) {
                var tmp = new {
                    FromTableName = uiTables.SingleOrDefault (x => x.ProjectDataId == line.FromTableId).Name,
                    ToTableName = uiTables.SingleOrDefault (x => x.ProjectDataId == line.ToTableId).Name,
                    FromColName = line.FromColName,
                    ToColName = line.ToColName,
                    LayerId = line.LayerId
                };
                uiLines.Add (tmp);
            }

            var queryList = new List<dynamic> ();
            foreach (var layer in layers) {

                var tmptables = uiTables.Where (x => x.LayerId == layer.LayerId).ToList();
                var tables = new List<dynamic>();
                foreach(var table in tmptables){
                    var schema = table.Schema.Split(',');
                    tables.Add(new {
                        ProjectDataId = table.ProjectDataId,
                        Name = table.Name,
                        Schema = schema,
                        LayerId = table.LayerId
                    });
                }

                var tmp = new {
                    Layer = layer,
                    Tables = tables,
                    Lines = uiLines.Where (x => x.LayerId == layer.LayerId)
                };
                queryList.Add (tmp);
            }
            //沒有任何Layer
            if (queryList.Count () < 1) {
                var newLayer = new Layer () {
                    ProjectId = ProjectId,
                    MainTableId = projectMainTable.ProjectDataId,
                    LayerName = projectMainTableInfo?.DataSetName
                };
                queryList.Add (new {
                    Layer = newLayer,
                        Tables = new List<dynamic> (),
                        Lines = new List<dynamic> ()
                });
            }

            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (queryList, Formatting.Indented));
        }

        [HttpGet ("LayerMaintableSelectOptions/{Id}")]
        /// <summary>
        /// MainTable 下拉選項清單
        /// </summary>
        /// <param name="Id">Project 編號</param>
        /// <returns></returns>
        public async Task<IActionResult> LayerMaintableSelectOptions ([FromRoute] int Id) {
            try {
                // 取得主table dataset schemas
                var projectDatas = _efCoreHelper.GetList<ProjectDatas> (_context).Where (x => x.ProjectId == Id);
                var projectDataSets = _efCoreHelper.GetList<DataSet> (_context);
                var query = from projectdata in projectDatas
                join dataset in projectDataSets
                on projectdata.DataSetId equals dataset.DataSetId
                select new {
                    TableId = projectdata.ProjectDataId,
                    TableName = dataset.DataSetName,
                    Schema = dataset.Schema,
                    DataType = dataset.DataType
                };
                //只取 Data 以外 properties
                var result = new List<dynamic> ();
                foreach (var item in query) {
                    dynamic schema = null;
                    switch (item.DataType) {
                        case 0:
                            {
                                schema = string.IsNullOrEmpty (item.Schema) ? new string[0] : item.Schema.Split (',');
                                break;
                            }
                        case 1:
                            {
                                try {
                                    schema = JsonConvert.DeserializeObject<dynamic> (item.Schema);
                                } catch { }
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }
                    var tmp = new {
                        TableId = item.TableId,
                        TableName = item.TableName,
                        DataType = item.DataType,
                        Schema = schema
                    };
                    result.Add (tmp);
                }
                await Task.CompletedTask;
                return Ok (JsonConvert.SerializeObject (result, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }

        [HttpPatch("SaveJoinDesign/{ProjectId}")]
        public async Task<IActionResult>  SaveJoinDesign([FromRoute] int ProjectId,[FromBody] SaveLayerDto[] body){
            // foreach(var layer in body){
            //     layer.layer.ProjectId = ProjectId;
            //     _efCoreHelper.PatchSingle<Layer>(_context,layer.layer,false);

            //     foreach(var table in layer.Tables){
            //         table.ProjectId = 
            //         _efCoreHelper.PatchSingle<JoinTables>
            //     }
            // }
            return Ok(JsonConvert.SerializeObject(body,Formatting.Indented));
        }
    }
    public class SaveLayerDto{
        public Layer layer{get;set;}
        public UITableDto[] Tables {get;set;}
        public JoinLines[] Lines {get;set;}
    }
    public class UITableDto{
        public int TableId {get;set;}
        public int Left {get;set;}
        public int Top {get;set;}
    }
}