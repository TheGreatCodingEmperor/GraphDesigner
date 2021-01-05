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
    public class JoinResultController:UIBaseController<GraphDesignerContext>{
        private readonly GraphDesignerContext _context;
        private IBasicEfcoreHelper _efCoreHelper { get; }
        private IJoinHelper _joinHelper {get;}
        public JoinResultController (GraphDesignerContext context, IBasicEfcoreHelper efCoreHelper, IJoinHelper joinHelper):base(context,efCoreHelper) {
            _context = context;
            _efCoreHelper = efCoreHelper;
            _joinHelper = joinHelper;
        }

        
    }
}