using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using GraphDesigner.Helpers;
using System;
using GraphDesigner.Models;

namespace GraphDesigner.Controllers {
    [ApiController]
    [Route ("api/[controller]")]

    public class ProjectDatasController:BaseController<ProjectDatas,int,GraphDesignerContext>
    {
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper {get;}
        public ProjectDatasController(GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper):base(context,efCoreHelper){
            _context = context;
            _efCoreHelper = efCoreHelper;
        }
    }
}