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
    var query = 'Select * from CapaianUnit';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/').post(function(req,res){
    var cek = 1;
    if(req.body.Unit_id == undefined){
      req.body.Unit_id = 0
    }
    console.log(req.body.Unit_id)
    var parameters = [
      { name: 'DataDasar_id', sqltype: sql.Int, value: req.body.DataDasar_id},
      { name: 'Unit_id', sqltype: sql.Int, value: req.body.Unit_id},
      { name: 'waktu', sqltype: sql.DateTime, value: req.body.waktu},
      { name: 'capaian', sqltype: sql.Float, value: req.body.capaian}
    ];
    var query = 'INSERT INTO CapaianUnit(DataDasar_id,Unit_id,waktu,capaian) VALUES (@DataDasar_id,@Unit_id,@waktu,@capaian)';
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:idd:idu').get(function(req,res){
    var cek = 2;
    var parameters;
    var query = "Select * from CapaianUnit WHERE DataDasar_id = " + req.params.idd + "and Unit_id =" + req.params.idu;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:DataDasar_id:Unit_id').put(function(req,res){
    var cek = 1;
    var parameters = [
      { name: 'DataDasar_id', sqltype: sql.Int, value: req.body.DataDasar_id},
      { name: 'Unit_id', sqltype: sql.Int, value: req.body.Unit_id},
      { name: 'waktu', sqltype: sql.DateTime, value: req.body.waktu},
      { name: 'capaian', sqltype: sql.Float, value: req.body.capaian}
    ];
    var query = "UPDATE CapaianUnit SET DataDasar_id = @DataDasar_id, Unit_id = @Unit_id, waktu = @waktu, capaian = @capaian WHERE DataDasar_id = " + req.params.DataDasar_id + "and Unit_id =" + req.params.Unit_id;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:idd:idu').delete(function(req,res){
    var query = "DELETE FROM CapaianUnit WHERE DataDasar_id = " + req.params.idd + "and Unit_id =" + req.params.idu;
    var parameters;
    var cek = 2;
    executeQuery (res, query,cek,parameters)
  });
  return router
};
module.exports = routes; 