using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using GraphDesigner.Helpers;
using System;
using GraphDesigner.Models;
using System.Collections.Generic;

namespace GraphDesigner.Controllers {
    [ApiController]
    [Route ("api/[controller]")]

    public class LayerController:BaseController<Layer,int,GraphDesignerContext>
    {
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper {get;}
        private IJoinHelper _joinHelper {get;}
        public LayerController(
            GraphDesignerContext context, 
            IBasicEfcoreHelper efCoreHelper,
            IJoinHelper joinHelper
            ):base(context,efCoreHelper){
            _context = context;
            _efCoreHelper = efCoreHelper;
            _joinHelper = joinHelper;
        }

        // [HttpPost ("multiJoin")]
        // public async Task<IActionResult> MultiJoin ([FromBody] SqlQuery body) {
        //     var datas = JsonConvert.DeserializeObject<Dictionary<string, List<Dictionary<string, object>>>> (body.Datas.ToString ());
        //     var result = _joinHelper.MultiJoin (datas, body.Lines);
        //     if (result.Status != 200) {
        //         return BadRequest (result.Result);
        //     }
        //     await Task.CompletedTask;
        //     return Ok (JsonConvert.SerializeObject (result.Result, Formatting.Indented));
        // }

        [HttpPost ("DataSet/MultiJoin")]
        public async Task<IActionResult> DataSetMultiJoin ([FromBody] DataSetJoinQuery body) {
            var query = from projectdata in _efCoreHelper.GetList<ProjectDatas> (_context).Where (x => x.ProjectId == body.MapId)
                        join dataset in _efCoreHelper.GetList<DataSet> (_context).Where (x => x.DataType == 0)
                        on projectdata.DataSetId equals dataset.DataSetId
                        select new { ProjectData = projectdata, DataSet = dataset };

            var datas = new Dictionary<string, List<Dictionary<string, object>>> ();
            foreach (var item in query) {
                datas[item.DataSet.DataSetName] = JsonConvert.DeserializeObject<List<Dictionary<string, object>>> (item.DataSet.Data);
            }
            var lines = new List<JoinLine>();
            foreach(var line in body.Lines){
                var tmp = new JoinLine();
                tmp.FromTableName = query.Where(x => x.ProjectData.ProjectDataId == line.FromTableId).SingleOrDefault()?.DataSet.DataSetName;
                tmp.ToTableName = query.Where(x => x.ProjectData.ProjectDataId == line.ToTableId).SingleOrDefault()?.DataSet.DataSetName;
                lines.Add(tmp);
            }
            var result = _joinHelper.MultiJoin (datas, lines.ToArray());
            if (result.Status != 200) {
                return BadRequest (result.Result);
            }
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (result.Result, Formatting.Indented));
        }
    }
    public class DataSetJoinQuery{
        public int MapId {get;set;}
        public JoinLines[] Lines{get;set;}
    }
}