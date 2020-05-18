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
    if(cek == 1 || cek == 3){
      parameters.forEach(function(p){
        request.input(p.name,p.sqltype,p.value);
      });
    }
    // query to the database and get the records
    request.query(query, function (err, recordset) {
        if (err) console.log(err)
        // send records as a respons
        if(cek == 0 || cek == 2 || cek == 3){
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
    var query = 'Select id,nama,email,level_unit,id_jns_satker,id_induk_satker,create_date,last_update,expired_date from SatuanKerja';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/nama').get(function(req,res){
    var query = 'Select id, nama as name from SatuanKerja';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/namadropdown').get(function(req,res){
    var query = "Select id, nama as name from SatuanKerja where nama like 'Departemen%' or nama like 'Fakultas%'";
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
    var parameters = [
      { name: 'id_jns_satker', sqltype: sql.Numeric, value: req.body.id_jns_satker },
      { name: 'id_induk_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_induk_satker },
      { name: 'level_unit', sqltype: sql.Int, value: req.body.level_unit },
      { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
      { name: 'email', sqltype: sql.VarChar, value: req.body.email },
      { name: 'expired_date', sqltype: sql.DateTime, value: tgl }
    ];
    var query = "insert into SatuanKerja( id, nama, level_unit, id_induk_satker, id_jns_satker, email, create_date, last_update, expired_date)" +
              "values( NEWID(), @nama, @level_unit, @id_induk_satker, @id_jns_satker, @email, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, @expired_date)"
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').get(function(req,res){
    var cek = 3;
    console.log(req.params.id);
    var param = [
      { name: 'id', sqltype: sql.UniqueIdentifier, value: req.body.id}
    ];
    var query = "Select id,nama,email,level_unit,id_jns_satker,id_induk_satker,create_date,last_update,expired_date from SatuanKerja WHERE id = @id";
    executeQuery(res,query,cek,param);
  });
  router.route('/:id').put(function(req,res){
    var cek = 1;
    var parameters = [
      { name: 'id', sqltype: sql.UniqueIdentifier, value: req.body.id },
      { name: 'id_jns_satker', sqltype: sql.Numeric, value: req.body.id_jns_satker },
      { name: 'id_induk_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_induk_satker },
      { name: 'level_unit', sqltype: sql.Int, value: req.body.level_unit },
      { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
      { name: 'email', sqltype: sql.VarChar, value: req.body.email },
    ];
    var query = "update SatuanKerja set id_jns_satker = @id_jns_satker, level_unit = @level_unit, id_induk_satker = @id_induk_satker, nama = @nama, email = @email, last_update = CURRENT_TIMESTAMP " +
    "where id = @id"
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id').delete(function(req,res){
    console.log(req.body.id);
    var param = [
      { name: 'id', sqltype: sql.UniqueIdentifier, value: req.body.id}
    ];
    var query = "DELETE FROM SatuanKerja WHERE id = @id";
    var cek = 1;
    executeQuery (res, query,cek,param)
  });
  return router
};
module.exports = routes; 