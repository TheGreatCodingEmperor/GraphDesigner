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
    [Route ("UI/[controller]")]
    public class UIBaseController<Tcontext> : ControllerBase
    where Tcontext : DbContext {
        private readonly Tcontext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public UIBaseController (Tcontext context, IBasicEfcoreHelper efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
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