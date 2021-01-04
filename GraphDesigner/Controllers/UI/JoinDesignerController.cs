using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using GraphDesigner.Helpers;
using Microsoft.AspNetCore.Mvc;
using GraphDesigner.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace GraphDesigner.Controllers {
    [ApiController]
    [Route ("UI/[controller]")]
    public class JoinDesignerController:UIBaseController<GraphDesignerContext>{
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public JoinDesignerController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper):base(context,efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet("GetJoinDataSetSchemas/{Id}")]
        public async Task<IActionResult> GetJoinDataSetSchemas([FromRoute] int Id){
            try{
                var projectDatasets = _efCoreHelper.GetList<ProjectDatas>(_context).Where(x => x.ProjectId == Id);
                var tableDatasets = _efCoreHelper.GetList<DataSet>(_context).Where(x => x.DataType ==0);
                var query = from projectData in projectDatasets
                            join dataset in tableDatasets
                            on projectData.DataSetId equals dataset.DataSetId
                            select new {
                                TableId = projectData.ProjectDataId,
                                TableName = dataset.DataSetName,
                                Schema = dataset.Schema
                            };
                var result = new List<dynamic>();
                foreach( var item in query){
                    var tmp = new {
                        TableId = item.TableId,
                        TableName = item.TableName,
                        Schema = string.IsNullOrEmpty(item.Schema)?new string[0]:item.Schema.Split(',')
                    };
                    result.Add(tmp);
                }
                await Task.CompletedTask;
                return Ok(JsonConvert.SerializeObject(result,Formatting.Indented));
            }
            catch(Exception e){
                return BadRequest(new {Result = e.ToString()});
            }
        }

        [HttpGet("LayerMaintableSelectOptions/{Id}")]
        public async Task<IActionResult> LayerMaintableSelectOptions([FromRoute] int Id){
            try{
                // 取得主table  dataset(topo => data, table=> schema)
                var projectDatas = _efCoreHelper.GetList<ProjectDatas>(_context).Where(x => x.ProjectId == Id);
                var projectDataSets = _efCoreHelper.GetList<DataSet>(_context);
                var query = from projectdata in projectDatas
                            join dataset in projectDataSets
                            on projectdata.DataSetId equals dataset.DataSetId
                            select new {
                                TableId = projectdata.ProjectDataId,
                                TableName = dataset.DataSetName,
                                Schema = dataset.Schema,
                                DataType = dataset.DataType
                            };
                var result = new List<dynamic>();
                foreach(var item in query){
                    dynamic schema = null;
                    switch(item.DataType){
                        case 0:{
                            schema = string.IsNullOrEmpty(item.Schema)?new string[0]:item.Schema.Split(',');
                            break;
                        }
                        case 1:{
                            try{
                                schema = JsonConvert.DeserializeObject<dynamic>(item.Schema);
                            }catch{}
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                    var tmp = new {
                        TableId = item.TableId,
                        TableName = item.TableName,
                        DataType = item.DataType,
                        Schema = schema
                    };
                    result.Add(tmp);
                }
                await Task.CompletedTask;
                return Ok(JsonConvert.SerializeObject(result,Formatting.Indented));
            }
            catch(Exception e){
                return BadRequest(new {Result = e.ToString()});
            }
        }
    }
}