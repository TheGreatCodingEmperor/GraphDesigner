using System;
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
    public class DataSetMangerController:UIBaseController<GraphDesignerContext>{
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public DataSetMangerController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper):base(context,efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet ("DataSetMangerList")]
        /// <summary>
        /// 取得專案清單(名稱、種類)
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> DataSetMangerList () {
            try {
                var datasetList = _efCoreHelper.GetList<DataSet> (_context).Select (x => new {
                    DataSetId = x.DataSetId,
                    DataSetName = x.DataSetName,
                    DataType = x.DataType
                }).ToList ();
                await Task.CompletedTask;
                return Ok (JsonConvert.SerializeObject (datasetList, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }

        [HttpDelete("RemoveDataSet/{ProjectId}")]
        public async Task<IActionResult> RemoveDataSet([FromRoute] int ProjectId){
            try{
                _efCoreHelper.RemoveSingle<DataSet,int>(_context,ProjectId,false);
                await Task.CompletedTask;
                return Ok();
            }catch(Exception e){
                return BadRequest (new { Result = e.ToString () });
            }
        }
    }
}