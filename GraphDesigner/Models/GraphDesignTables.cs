using System.ComponentModel.DataAnnotations;

namespace GraphDesigner.Models {
    public class DataSet {
        [Key]
        public int DataSetId { get; set; }
        public int DataType { get; set; }
        public string Schema { get; set; }
        public string DataSetName { get; set; }
        public string Roles { get; set; }
        public string OrganizationId { get; set; }
        public string Data { get; set; }
    }

    public class Project {
        [Key]
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string Roles { get; set; }
        public string OrganizationId { get; set; }
        public int ProjectType { get; set; }
        public string Design { get; set; }
    }
    public class ProjectDatas {
        [Key]
        public int ProjectDataId { get; set; }
        public int ProjectId { get; set; }
        public int DataSetId { get; set; }
        public bool? IsProjectMainTable {get;set;}
    }
    public class Layer {
        [Key]
        public int LayerId { get; set; }
        public string LayerName {get;set;}
        public int ProjectId { get; set; }
        public int MainTableId { get; set; }
        public string ObjectType {get;set;}
        public string PkColName {get;set;}
        public string LongitudeColName {get;set;} 
        public string LatitudeColName {get;set;}
        public string JoinPkName {get;set;}
        public int? JoinPkTableId {get;set;}
    }
    public class JoinLines {
        [Key]
        public int JoinLineId { get; set; }
        public int ProjectId { get; set; }
        public int LayerId { get; set; }
        public int FromTableId { get; set; }
        public string FromColName { get; set; }
        public int ToTableId { get; set; }
        public string ToColName { get; set; }
    }
    public class JoinTables {
        [Key]
        public int JoinTableId { get; set; }
        public int ProjectId{get;set;}
        public int ProjectDataId { get; set; }
        public int LayerId {get;set;}
        public int Left { get; set; }
        public int Top { get; set; }
    }
}