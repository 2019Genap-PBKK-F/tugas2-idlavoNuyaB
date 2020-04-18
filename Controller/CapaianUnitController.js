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
    var query = 'Select * from Capaian_Unit';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/').post(function(req,res){
    var cek = 1;
    var tgl = new Date();
    tgl.getTime();
    var parameters = [
      { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker},
      { name: 'id_datadasar', sqltype: sql.Int, value: req.body.id_datadasar},
      { name: 'waktu', sqltype: sql.DateTime, value: tgl},
      { name: 'capaian', sqltype: sql.Float, value: req.body.capaian}
    ];
    var query = 'INSERT INTO Capaian_Unit(id_satker,id_datadasar,waktu,capaian) VALUES (@id_satker,@id_datadasar,@waktu,@capaian)';
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:idd:idu').get(function(req,res){
    var cek = 1;
    var parameters = [
      { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.params.idu},
      { name: 'id_datadasar', sqltype: sql.Int, value: req.params.idd},
    ];
    var query = "Select * from Capaian_Unit WHERE id_satker = @id_satker and id_datadasar = @id_datadasar";
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id_datadasar:id_satker').put(function(req,res){
    var cek = 1;
    var parameters = [
      { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker},
      { name: 'id_datadasar', sqltype: sql.Int, value: req.body.id_datadasar},
      { name: 'capaian', sqltype: sql.Float, value: req.body.capaian},
      { name: 'id_satkea', sqltype: sql.UniqueIdentifier, value: req.params.id_satker},
      { name: 'id_datadasaa', sqltype: sql.Int, value: req.params.id_datadasar}
    ];
    var query = "UPDATE Capaian_Unit SET id_satker = @id_satker, id_datadasar = @id_datadasar, waktu = CURRENT_TIMESTAMP, capaian = @capaian WHERE id_satker = @id_satkea and id_datadasar = @id_datadasaa";
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:idd:idu').delete(function(req,res){
    console.log(req.params.idd + ' ' + req.params.idu)
    var parameters = [
      { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.params.idu},
      { name: 'id_datadasar', sqltype: sql.Int, value: req.params.idd},
    ];
    var query = "DELETE FROM Capaian_Unit WHERE id_satker = @id_satker and id_datadasar = @id_datadasar";
    var parameters;
    var cek = 1;
    executeQuery (res, query,cek,parameters)
  });
  return router
};
module.exports = routes; 