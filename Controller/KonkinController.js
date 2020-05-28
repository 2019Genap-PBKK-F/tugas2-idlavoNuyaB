var express = require('express');
var router = express.Router();
var sql = require("mssql");
var config = require("../Connection/config");

var executeQuery = function(res,query,cek,parameters){
  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    if(cek == 1){
      parameters.forEach(function(p){
        request.input(p.name,p.sqltype,p.value);
      });
    }
    // query to the database and get the records
    request.query(query, function (err, recordset) {
        if (err) console.log(err)
        // send records as a respons
        if(cek == 0 || cek == 2){
          res.send(recordset.recordset);
        }
        else if(cek == 1){
          res.send(recordset);
        }
        sql.close();
    });
  });
}

var routes = function(){
  router.route('/').get(function(req,res){
    var query = 'Select * from konkin order by Satuan Desc, apk asc';
    executeQuery(res,query,0,0);
  });
  router.route('/tabel/:id').get(function(req,res){
    var model = [
      { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.params.id }
    ]
    var query = "select row_number() over (order by apk.aspek) as num, apk.aspek as Aspek, apk.komponen_aspek as Komponen, mi.nama as Indikator, " +
                "isk.bobot as Bobot, isk.target as Target, isk.capaian as Capaian from Indikator_SatuanKerja isk " +
                "Inner Join MasterIndikator mi on isk.id_master = mi.id inner join Aspek apk on mi.id_aspek = apk.id " +
                "inner join SatuanKerja sk on isk.id_satker = sk.id where sk.id = @id_satker" 
                
    executeQuery(res, query, 1, model)
  })
  return router
};
module.exports = routes; 
