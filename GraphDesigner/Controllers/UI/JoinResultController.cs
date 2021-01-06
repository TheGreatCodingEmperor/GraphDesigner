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
    public class JoinResultController:UIBaseController<GraphDesignerContext>{
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        private IJoinHelper _joinHelper {get;}
        public JoinResultController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper, IJoinHelper joinHelper):base(context,efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
            _joinHelper = joinHelper;
        }

        [HttpPost("DataSetInnerJoin")]
        public async Task<IActionResult> DataSetInnerJoin([FromBody]JoinResultDto body){
            var projectDatas = _efCoreHelper.GetList<ProjectDatas>(_context).Where(x => x.ProjectId == body.ProjectId);
            //join projectDatas、dataset
            var query = from projectData in projectDatas
                        join dataset in _efCoreHelper.GetList<DataSet>(_context).Where(x => x.DataType == 0)
                        on projectData.DataSetId equals dataset.DataSetId
                        select new {
                            TableId = projectData.ProjectDataId,
                            TableName = dataset.DataSetName,
                            Data = dataset.Data
                        };
            var projectDataSets = query.ToList();
            //組合 joinLine[]
            var joinLines = new List<JoinLine>();
            foreach(var item in body.Lines){
                var tmp = new JoinLine(){
                    FromTableName = projectDataSets.SingleOrDefault(x => x.TableId == item.FromTableId).TableName,
                    ToTableName = projectDataSets.SingleOrDefault(x => x.TableId == item.ToTableId).TableName,
                    FromColName = item.FromColName,
                    ToColName = item.ToColName
                };
                joinLines.Add(tmp);
            }

            // 名稱對應唯一編號
            var nameIds = new List<dynamic>();
            //組合 data:{"TableName1":[{}],"TableName2":[]}
            var datas = new Dictionary<string, List<Dictionary<string, object>>> ();
            foreach (var item in projectDataSets) {
                var tmp = new {
                    Name = item.TableName,
                    Id = item.TableId
                };
                nameIds.Add(tmp);
                datas[item.TableName] = JsonConvert.DeserializeObject<List<Dictionary<string, object>>> (item.Data);
            }
            //joinhelper multijoin
            var result = _joinHelper.MultiJoin(datas,joinLines.ToArray());
            await Task.CompletedTask;
            if(result.Status != 200){
                return BadRequest(new {result= result.Result});
            }
            return Ok(JsonConvert.SerializeObject(new {Tables = nameIds,Data = result.Result},Formatting.Indented));
        }
    }
    public class JoinResultDto{
        public int ProjectId {get;set;}
        public JoinLines[] Lines {get;set;}
    }
}