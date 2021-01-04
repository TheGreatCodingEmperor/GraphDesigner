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
    public class JoinDesignerController:UIBaseController<GraphDesignerContext>{
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        public JoinDesignerController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper):base(context,efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
        }
    }
}