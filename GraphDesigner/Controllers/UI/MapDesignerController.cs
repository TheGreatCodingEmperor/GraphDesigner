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
    public class MapDesignerController : UIBaseController<GraphDesignerContext> {
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public MapDesignerController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper) : base (context, efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet("map/{ProjectId}")]
        public async Task<IActionResult> GetMap([FromRoute] int ProjectId){
            var projectMainData = _efCoreHelper.GetList<ProjectDatas>(_context).Where(x => x.ProjectId == ProjectId).SingleOrDefault(x => x.IsProjectMainTable == true);
            var mainTopo = _efCoreHelper.GetList<DataSet>(_context).SingleOrDefault(x => x.DataSetId == projectMainData.DataSetId);
            return Ok(mainTopo.Data);
        }

        
    }
}