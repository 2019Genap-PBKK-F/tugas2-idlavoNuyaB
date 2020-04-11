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
    var query = 'Select id,nama as name from KategoriUnit';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/').post(function(req,res){
    var cek = 1;
    var parameters = [
      { name: 'nama', sqltype: sql.VarChar(50), value: req.body.nama},
    ];
    var query = 'INSERT INTO KategoriUnit(nama) VALUES (@nama)';
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').get(function(req,res){
    var cek = 2;
    var parameters;
    var query = "Select * from KategoriUnit WHERE id = " + req.params.id;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').put(function(req,res){
    var cek = 1;
    var parameters = [
      { name: 'id', sqltype: sql.Int, value: req.params.id},
      { name: 'nama', sqltype: sql.VarChar(50), value: req.body.nama}
    ];
    var query = "UPDATE KategoriUnit SET nama = @nama WHERE id = @id";
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').delete(function(req,res){
    var query = "DELETE FROM KategoriUnit WHERE Id=" + req.params.id;
    var parameters;
    var cek = 2;
    executeQuery (res, query,cek,parameters)
  });
  return router
};
module.exports = routes; 