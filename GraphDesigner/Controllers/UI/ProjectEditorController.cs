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
        /// <summary>
        /// 取得 UI 編輯 dataSetEdit
        /// </summary>
        /// <param name="Id">Project 編號</param>
        /// <returns></returns>
        public async Task<IActionResult> GetDataSetEdit ([FromRoute] int Id) {
            try {
                var project = _efCoreHelper.GetSingle<Project, int> (_context, Id);
                if (project == null) {
                    return NotFound ();
                }
                var projectDatas = _efCoreHelper.GetList<ProjectDatas> (_context).Where (x => x.ProjectId == Id).ToList ();
                var mainTableId = projectDatas.SingleOrDefault (x => x.IsProjectMainTable == true)?.DataSetId;
                var projectDataIds = projectDatas.Select (x => x.DataSetId).ToList ();
                await Task.CompletedTask;
                return Ok (JsonConvert.SerializeObject (new {
                    ProjectId = project.ProjectId,
                        ProjectName = project.ProjectName,
                        ProjectType = project.ProjectType,
                        MainTableId = mainTableId,
                        Design = project.Design,
                        ProjectDataIds = projectDataIds
                }, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }

        [HttpPatch ("SaveProjectEdit")]
        public async Task<IActionResult> SaveProjectEdit ([FromBody] ProjectEditoSaveDto body) {
            try {
                var inputProject = JsonConvert.DeserializeObject<Project> (JsonConvert.SerializeObject (body.project));
                //更新 Project
                _efCoreHelper.PatchSingle<Project> (_context, inputProject, false);

                //現有 project datas(n筆)
                var currrentProjectDatas = _efCoreHelper.GetList<ProjectDatas> (_context).Where (x => x.ProjectId == body.project.ProjectId).ToList ();
                var repeatMainTableId = body.projectDataIds.ToList().FirstOrDefault(x => x==body.project.MainTableId);
                if(repeatMainTableId == 0){
                    body.projectDataIds = body.projectDataIds.Where(x => x!=body.project.MainTableId).Concat(new int[]{(int)body.project.MainTableId}).ToArray();
                }

                //input、current datasetId 相同
                foreach (var tableId in body.projectDataIds) {
                    var exist = currrentProjectDatas.FirstOrDefault (x => x.DataSetId == tableId);
                    if (exist != null) {
                        body.projectDataIds = body.projectDataIds.Where (x => x != tableId).ToArray ();
                        currrentProjectDatas = currrentProjectDatas.Where (x => x.DataSetId != tableId).ToList ();
                        if(tableId == body.project.MainTableId){
                            exist.IsProjectMainTable = true;
                        }
                        else{
                            exist.IsProjectMainTable = false;
                        }
                        _efCoreHelper.PatchSingle<ProjectDatas>(_context,exist,true);
                    }
                }
                
                //current 有 input 沒有
                foreach (var table in currrentProjectDatas) {
                    _efCoreHelper.RemoveSingle<ProjectDatas, int> (_context, table.ProjectDataId, true);
                }
                await _context.SaveChangesAsync ();

                //input 有 current 沒有
                foreach (var tableId in body.projectDataIds) {
                    var insert = new ProjectDatas ();
                    insert.ProjectId = inputProject.ProjectId;
                    insert.DataSetId = tableId;
                    // maintableId 更新過移除
                    if(body.project.MainTableId!=null && tableId == body.project.MainTableId){
                        insert.IsProjectMainTable = true;
                    }
                    else{
                        insert.IsProjectMainTable = false;
                    }
                    _efCoreHelper.PatchSingle<ProjectDatas> (_context, insert, true);
                }
                await _context.SaveChangesAsync ();

                return Ok (new { ProjectId =inputProject.ProjectId });
            } catch (Exception e) {
                return BadRequest (new { Result = e.ToString () });
            }
        }
    }
    public class ProjectEditoSaveDto {
        public ProjectEditAPIDto project { get; set; }
        public int[] projectDataIds { get; set; }
    }
    public class ProjectEditAPIDto {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int? MainTableId { get; set; }
        public string Roles { get; set; }
        public string OrganizationId { get; set; }
        public int ProjectType { get; set; }
        public string Design { get; set; }
    }
}