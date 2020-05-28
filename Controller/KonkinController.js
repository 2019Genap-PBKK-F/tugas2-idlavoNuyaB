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
  router.route('/:id').get(function(req,res){
    var model = [
      { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.params.id }
    ]
    var query = 'Select row_number() over (order by Aspek) as num, Aspek,[Komponen Aspek],[Indikator Kinerja]' +
                ',Bobot,Target,Capaian from konkin';
    executeQuery(res,query,0,model);
  });
  return router
};
module.exports = routes; 
