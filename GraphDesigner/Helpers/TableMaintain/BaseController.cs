using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using GraphDesigner.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace GraphDesigner.Controllers {
    [ApiController]
    [Route ("api/[controller]")]
    [ApiExplorerSettings (GroupName = "MainTain")]
    public class BaseController<T, Tkey, Tcontext> : ControllerBase
    where T : class
    where Tcontext : DbContext {
        private readonly Tcontext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public BaseController (Tcontext context, IBasicEfcoreHelper efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }

        [HttpGet ("{Id}")]
        /// <summary>
        /// 根據 Primar Key 取得單筆資料
        /// </summary>
        /// <param name="Id">Primar Key</param>
        /// <returns></returns>
        public virtual async Task<IActionResult> GetDataAPI ([FromRoute] Tkey Id) {
            var dbSet = _efCoreHelper.GetSingle<T, Tkey> (_context, Id);
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSet, Formatting.Indented));
        }

        [HttpGet]
        /// <summary>
        /// 取得所有資料
        /// </summary>
        /// <returns></returns>
        public virtual async Task<IActionResult> GetDatasAPI () {
            var dbSets = _efCoreHelper.GetList<T> (_context).ToList ();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSets, Formatting.Indented));
        }

        [HttpPatch]
        /// <summary>
        /// 更新/新增 一筆資料
        /// </summary>
        /// <param name="body">更新/新增 資料</param>
        /// <returns></returns>
        public virtual async Task<IActionResult> PatchDataAPI ([FromBody] T body) {
            try {
                _efCoreHelper.PatchSingle<T> (_context, body, true);
                await _context.SaveChangesAsync ();
                return Ok (JsonConvert.SerializeObject (body, Formatting.Indented));
            } catch (Exception e) {
                return BadRequest (e.ToString ());
            }
        }

        [HttpDelete ("{Id}")]
        /// <summary>
        /// 根據Primary Key 刪除一筆資料
        /// </summary>
        /// <param name="Id">Primary Key</param>
        /// <returns></returns>
        public virtual async Task<IActionResult> DeleteDataAPI ([FromRoute] Tkey Id) {
            await Task.CompletedTask;
            try {
                _efCoreHelper.RemoveSingle<T, Tkey> (_context, Id, false);
                return Ok ();
            } catch (Exception e) {
                return BadRequest (e.ToString ());
            }
        }
        public virtual Tobj DeepClone<Tobj> (Tobj res, Tobj newT) {
            var properties = typeof (Tobj).GetProperties ();
            foreach (var property in properties) {
                property.SetValue (res, property.GetValue (newT));
            }
            return res;
        }
    }
}