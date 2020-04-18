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
    var query = 'Select * from Indikator_Periode';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/').post(function(req,res){
    var cek = 1;
    var parameters = [
        { name: 'id_master', sqltype: sql.Int, value: req.body.id_master },
        { name: 'id_periode', sqltype: sql.Numeric, value: req.body.id_periode },
        { name: 'bobot', sqltype: sql.Float, value: req.body.bobot },
    ];
    var query = "insert into Indikator_Periode values( @id_master, @id_periode, @bobot )"
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id:idd').get(function(req,res){
    var cek = 2;
    var parameters;
    var query = "Select * from Indikator_Periode WHERE id_master = " + req.params.id + "and id_periode = " + req.params.idd;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id_master:id_periode').put(function(req,res){
    var cek = 1;
    var parameters = [
        { name: 'id_master', sqltype: sql.Int, value: req.body.id_master },
        { name: 'id_periode', sqltype: sql.Numeric, value: req.body.id_periode },
        { name: 'bobot', sqltype: sql.Float, value: req.body.bobot },
        { name: 'id_mastea', sqltype: sql.Int, value: req.params.id_master },
        { name: 'id_perioda', sqltype: sql.Numeric, value: req.params.id_periode }
    ];
    var query = "update Indikator_Periode set id_master = @id_master, id_periode = @id_periode, bobot = @bobot where id_master = @id_mastea and id_periode = @id_perioda" 
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id:idd').delete(function(req,res){
    var query = "DELETE FROM Indikator_Periode WHERE id_master = " + req.params.id + " and id_periode = " + req.params.idd;
    var parameters;
    var cek = 2;
    executeQuery (res, query,cek,parameters)
  });
  return router
};
module.exports = routes; 