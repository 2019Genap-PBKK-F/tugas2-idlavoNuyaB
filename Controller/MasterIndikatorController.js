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
    var query = "select * from MasterIndikator"
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/').post(function(req,res){
    var cek = 1;
    var tgl = new Date();
    tgl.getTime();
    tgl.setDate(31);
    tgl.setMonth(12);
    console.log(req.body.deskripsi);
    var parameters = [
        { name: 'id_penyebut', sqltype: sql.Int, value: req.body.id_penyebut },
        { name: 'id_pembilang', sqltype: sql.Int, value: req.body.id_pembilang },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { name: 'deskripsi', sqltype: sql.VarChar, value: req.body.deskripsi },
        { name: 'default_bobot', sqltype: sql.Float, value: req.body.default_bobot },
        { name: 'expired_date', sqltype: sql.DateTime, value: tgl }
    ];
    var query = "insert into MasterIndikator( id_penyebut, id_pembilang, nama, deskripsi, default_bobot, create_date, last_update, expired_date ) "
    + "values( @id_penyebut, @id_pembilang, @nama, @deskripsi, @default_bobot, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, @expired_date)";
    executeQuery(res,query,cek,parameters);
  });
  router.route('/nama').get(function(req,res){
    var query = 'Select id, nama as name from MasterIndikator';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').get(function(req,res){
    var cek = 2;
    var parameters;
    var query = "Select * from MasterIndikator WHERE id = " + req.params.id;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').put(function(req,res){
    var cek = 1;
    var parameters = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        { name: 'id_penyebut', sqltype: sql.Int, value: req.body.id_penyebut },
        { name: 'id_pembilang', sqltype: sql.Int, value: req.body.id_pembilang },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { name: 'deskripsi', sqltype: sql.VarChar, value: req.body.deskripsi },
        { name: 'default_bobot', sqltype: sql.Float, value: req.body.default_bobot }
    ];
    console.log(req.body.deskripsi);
    var query = "update MasterIndikator set id_penyebut = @id_penyebut, id_pembilang = @id_pembilang, nama = @nama, deskripsi = @deskripsi, "
    + "default_bobot = @default_bobot, last_update = CURRENT_TIMESTAMP where id = @id";
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').delete(function(req,res){
    var query = "DELETE FROM MasterIndikator WHERE Id=" + req.params.id;
    var parameters;
    var cek = 2;
    executeQuery (res, query,cek,parameters)
  });
  return router
};
module.exports = routes; 