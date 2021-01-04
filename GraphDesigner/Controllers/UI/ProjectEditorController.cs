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
    public class ProjectEditorController : UIBaseController<GraphDesignerContext> {
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public ProjectEditorController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper) : base (context, efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet ("GetDataSetEdit/{Id}")]
        public async Task<IActionResult> GetDataSetEdit ([FromRoute] int Id) {
            try {
                var project = _efCoreHelper.GetSingle<Project, int> (_context, Id);
                if (project == null) {
                    return NotFound ();
                }
                var projectDatas = _efCoreHelper.GetList<ProjectDatas>(_context).Where(x => x.ProjectId == Id).Select(x => x.DataSetId).ToList();
                await Task.CompletedTask;
                return Ok (JsonConvert.SerializeObject (new {
                    ProjectId = project.ProjectId,
                    ProjectName = project.ProjectName,
                    MainTableId = project.MainTableId,
                    ProjectType = project.ProjectType,
                    Design = project.Design,
                    ProjectDataIds = projectDatas
                }, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }
        [HttpPatch("SaveProjectEdit")]
        public async Task<IActionResult> SaveProjectEdit([FromBody] ProjectEditoSaveDto body){
            try{
                //更新 Project
                _efCoreHelper.PatchSingle<Project>(_context,body.project,false);

                //現有 project datas(n筆)
                var currrentProjectDatas = _efCoreHelper.GetList<ProjectDatas>(_context).Where(x => x.ProjectId == body.project.ProjectId).ToList();
                //input、current datasetId 相同
                foreach(var tableId in body.projectDataIds){
                    var exist = currrentProjectDatas.FirstOrDefault(x => x.DataSetId == tableId);
                    if(exist!=null){
                        body.projectDataIds = body.projectDataIds.Where(x => x!=tableId).ToArray();
                        currrentProjectDatas = currrentProjectDatas.Where(x => x.DataSetId != tableId).ToList();
                    }
                }
                //current 有 input 沒有
                foreach(var table in currrentProjectDatas){
                    _efCoreHelper.RemoveSingle<ProjectDatas,int>(_context,table.DataSetId,true);
                }
                //input 有 current 沒有
                foreach(var tableId in body.projectDataIds){
                    var insert = new ProjectDatas();
                    insert.ProjectId = body.project.ProjectId;
                    insert.DataSetId = tableId;
                    _efCoreHelper.PatchSingle<ProjectDatas>(_context,insert,true);
                }
                await _context.SaveChangesAsync();
                return Ok(new { ProjectId = body.project.ProjectId});
            }
            catch(Exception e){
                return BadRequest(new {Result = e.ToString()});
            }
        }
    }
    public class ProjectEditoSaveDto{
        public Project project {get;set;}
        public int[] projectDataIds {get;set;}
    }
}