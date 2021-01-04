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
    public class ProjectManagerController : UIBaseController<GraphDesignerContext> {
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public ProjectManagerController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper) : base (context, efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet ("ProjectList")]
        /// <summary>
        /// 取得專案清單(名稱、種類)
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> GetProjectList () {
            try {
                var projectList = _efCoreHelper.GetList<Project> (_context).Select (x => new {
                    ProjectId = x.ProjectId,
                        ProjectName = x.ProjectName,
                        ProjectType = x.ProjectType
                }).ToList ();
                await Task.CompletedTask;
                return Ok (JsonConvert.SerializeObject (projectList, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest(new { Result = e.ToString() });
            }
        }
    }
}