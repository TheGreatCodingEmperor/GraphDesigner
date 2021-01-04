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
    public class DataSetEditorController : UIBaseController<GraphDesignerContext> {
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public DataSetEditorController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper) : base (context, efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet ("GetDataSetEdit/{Id}")]
        public async Task<IActionResult> GetDataSetEdit ([FromRoute] int Id) {
            try {
                var DataSetEdit = _efCoreHelper.GetSingle<DataSet, int> (_context, Id);
                if (DataSetEdit == null) {
                    return NotFound ();
                }
                await Task.CompletedTask;
                dynamic data = null;
                if (DataSetEdit.DataType == 0) {
                    try { data = JsonConvert.DeserializeObject<List<dynamic>> (DataSetEdit.Data); } 
                    catch { data = new List<dynamic> (); }
                }
                else{
                    try { data = JsonConvert.DeserializeObject<dynamic> (DataSetEdit.Data); } 
                    catch { data = new object(); }
                }

                return Ok (JsonConvert.SerializeObject (new {
                    DataSetId = DataSetEdit.DataSetId,
                        DataType = DataSetEdit.DataType,
                        DataSetName = DataSetEdit.DataSetName,
                        Schema = DataSetEdit.Schema?.Split (','),
                        Data = data
                }, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }

        [HttpPatch ("SaveDataSetEdit")]
        public async Task<IActionResult> SaveDataSet ([FromBody] DataSet body) {
            try {
                _efCoreHelper.PatchSingle<DataSet> (_context, body, false);
                await Task.CompletedTask;
                return Ok (new { DataSetId = body.DataSetId });
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }
    }
}