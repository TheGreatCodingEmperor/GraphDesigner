using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using GraphDesigner.Models;
using Newtonsoft.Json;
using Z.Expressions;

namespace GraphDesigner.Helpers {
    public interface IJoinHelper {
        public object InnerJoin (SqlQueryData a, SqlQueryData b, string aKeyName, string bKeyName);
        public LogicLayerResponse MultiJoin (Dictionary<string, List<Dictionary<string, object>>> data, JoinLine[] lines);
    }
    public class JoinHelper : IJoinHelper {
        public JoinHelper () {
        }


        public object InnerJoin (SqlQueryData a, SqlQueryData b, string aKeyName, string bKeyName) {
            var query = from aRow in a.Data
            from bRow in b.Data
            where JsonEquals (aRow[aKeyName], bRow[bKeyName])
            select new Dictionary<string, object> () {
                [a.Name] = aRow, [b.Name] = bRow
            };
            return query;
        }

        /// <summary>
        /// {table1:[{a:1,b:2},{.}],table2:[]}
        /// </summary>
        /// <param name="data">{table1:[{a:1,b:2},{.}],table2:[]}</param>
        /// <param name="lines">{FromTableName,ToTableName,FromColName,ToColName}</param>
        /// <returns></returns>
        public LogicLayerResponse MultiJoin (Dictionary<string, List<Dictionary<string, object>>> data, JoinLine[] lines) {
            var result = new LogicLayerResponse ();
            try {
                var currentData = new List<string> ();
                var tmp = "";
                for (var i = 0; i < lines.Length; i++) {
                    var fromTable = lines[i].FromTableName.Replace(" ","_");
                    var toTable = lines[i].ToTableName.Replace(" ","_");
                    var fromCol = lines[i].FromColName;
                    var toCol = lines[i].ToColName;
                    if (i == 0) {
                        tmp += $"data[\"{fromTable}\"].Join(data[\"{toTable}\"], {fromTable}=>{fromTable}[\"{fromCol}\"], {toTable}=>{toTable}[\"{toCol}\"], ({fromTable},{toTable})=>new{{{fromTable},{toTable}}})";
                    } else {
                        tmp += $".Join(data[\"{toTable}\"], query=>query.{fromTable}[\"{fromCol}\"], {toTable}=>{toTable}[\"{toCol}\"], (query,{toTable})=>new{{{Query2dTo1d(currentData.ToArray())}{toTable}}})";
                    }
                    if (currentData.FirstOrDefault (x => x == fromTable) == null) {
                        currentData.Add (fromTable);
                    }
                    if (currentData.FirstOrDefault (x => x == toTable) == null) {
                        currentData.Add (toTable);
                    }
                }
                result.Status = 200;
                result.Result = Eval.Execute (tmp, new { data = data });
            } catch (Exception e) {
                result.Status = 400;
                result.Result = e.ToString ();
            }
            return result;
        }

        public static string Query2dTo1d (string[] tables) {
            var str = "";
            foreach (var table in tables) {
                str += $"query.{table},";
            }
            return str;
        }

        public bool JsonEquals (JsonElement x, JsonElement y) {
            if (x.ValueKind != y.ValueKind)
                return false;
            switch (x.ValueKind) {
                case JsonValueKind.Null:
                case JsonValueKind.True:
                case JsonValueKind.False:
                case JsonValueKind.Undefined:
                    return true;

                    // Compare the raw values of numbers, and the text of strings.
                    // Note this means that 0.0 will differ from 0.00 -- which may be correct as deserializing either to `decimal` will result in subtly different results.
                    // Newtonsoft's JValue.Compare(JTokenType valueType, object? objA, object? objB) has logic for detecting "equivalent" values, 
                    // you may want to examine it to see if anything there is required here.
                    // https://github.com/JamesNK/Newtonsoft.Json/blob/master/Src/Newtonsoft.Json/Linq/JValue.cs#L246
                case JsonValueKind.Number:
                    return x.GetRawText () == y.GetRawText ();

                case JsonValueKind.String:
                    return x.GetString () == y.GetString (); // Do not use GetRawText() here, it does not automatically resolve JSON escape sequences to their corresponding characters.

                    // case JsonValueKind.Array:
                    //     return x.EnumerateArray ().SequenceEqual (y.EnumerateArray (), this);

                case JsonValueKind.Object:
                    {
                        // Surprisingly, JsonDocument fully supports duplicate property names.
                        // I.e. it's perfectly happy to parse {"Value":"a", "Value" : "b"} and will store both
                        // key/value pairs inside the document!
                        // A close reading of https://tools.ietf.org/html/rfc8259#section-4 seems to indicate that
                        // such objects are allowed but not recommended, and when they arise, interpretation of 
                        // identically-named properties is order-dependent.  
                        // So stably sorting by name then comparing values seems the way to go.
                        var xPropertiesUnsorted = x.EnumerateObject ().ToList ();
                        var yPropertiesUnsorted = y.EnumerateObject ().ToList ();
                        if (xPropertiesUnsorted.Count != yPropertiesUnsorted.Count)
                            return false;
                        var xProperties = xPropertiesUnsorted.OrderBy (p => p.Name, StringComparer.Ordinal);
                        var yProperties = yPropertiesUnsorted.OrderBy (p => p.Name, StringComparer.Ordinal);
                        foreach (var (px, py) in xProperties.Zip (yProperties)) {
                            if (px.Name != py.Name)
                                return false;
                            if (!Equals (px.Value, py.Value))
                                return false;
                        }
                        return true;
                    }

                default:
                    throw new System.Text.Json.JsonException (string.Format ("Unknown JsonValueKind {0}", x.ValueKind));
            }
        }
    }
    public class SqlQueryData{
        public String Name {get;set;}
        public List<dynamic> Data {get;set;}
    }
    public class JoinLine{
        public string FromTableName {get;set;}
        public string ToTableName {get;set;}
        public string FromColName {get;set;}
        public string ToColName {get;set;}
    }
}