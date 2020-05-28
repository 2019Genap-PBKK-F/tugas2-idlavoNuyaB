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
    var query = 'Select * from Indikator_SatuanKerja';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
  });
  // router.route('/:id').get(function (req,res){
  //   var model = [
  //     { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.params.id }
  //   ]
  //   var query = "select row_number() over (order by apk.aspek) as num, apk.aspek as Aspek, apk.komponen_aspek as Komponen, mi.nama as Indikator, " +
  //               "isk.bobot as Bobot, isk.target as Target, isk.capaian as Capaian from Indikator_SatuanKerja isk " +
  //               "Inner Join MasterIndikator mi on isk.id_master = mi.id inner join Aspek apk on mi.id_aspek = apk.id " +
  //               "inner join SatuanKerja sk on isk.id_satker = sk.id where sk.id = @id_satker" 
                
  //   executeQuery(res, query, 1, model)
  // });
  router.route('/').post(function(req,res){
    var cek = 1;
    var parameters = [
        { name: 'id_periode', sqltype: sql.Numeric, value: req.body.id_periode },
        { name: 'id_master', sqltype: sql.Int, value: req.body.id_master },
        { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker },
        { name: 'bobot', sqltype: sql.Float, value: req.body.bobot },
        { name: 'target', sqltype: sql.Float, value: req.body.target },
        { name: 'capaian', sqltype: sql.Float, value: req.body.capaian }
    ];
    var query = "insert into Indikator_SatuanKerja (id_periode, id_master, id_satker, bobot, target, capaian, last_update) values( @id_periode, @id_master, @id_satker, @bobot, @target, @capaian, CURRENT_TIMESTAMP)"
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:idd/:id/:idm').get(function(req,res){
    var cek = 2;
    var parameters;
    var query = "Select * from Indikator_SatuanKerja WHERE id_periode = " + req.params.id + ", id_master = " + req.params.idd + "and id_periode = " + req.params.idm;
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id_master/:id_periode/:id_satker').put(function(req,res){
    var cek = 1;
    var parameters = [
        { name: 'id_periode', sqltype: sql.Numeric(4,0), value: req.body.id_periode },
        { name: 'id_master', sqltype: sql.Int, value: req.body.id_master },
        { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker },
        { name: 'bobot', sqltype: sql.Float, value: req.body.bobot },
        { name: 'target', sqltype: sql.Float, value: req.body.target },
        { name: 'capaian', sqltype: sql.Float, value: req.body.capaian },
        { name: 'id_perioda', sqltype: sql.Numeric, value: req.params.id_periode },
        { name: 'id_mastea', sqltype: sql.Int, value: req.params.id_master },
        { name: 'id_satkea', sqltype: sql.UniqueIdentifier, value: req.params.id_satker },
    ];
    var query = "update Indikator_SatuanKerja set id_periode = @id_periode, id_master = @id_master, id_satker = @id_satker, bobot = @bobot, target = @target, capaian = @capaian, last_update = CURRENT_TIMESTAMP where (id_periode = @id_perioda and id_master = @id_mastea) and (id_satker = @id_satkea)";
    executeQuery(res,query,cek,parameters);
  });
  router.route('/:id/:idd/:idm').delete(function(req,res){
    console.log(req.params.id_periode);
    console.log(req.params.id_master);
    console.log(req.params.id_satker);
    var parameters = [
      { name: 'id_periode', sqltype: sql.Numeric, value: req.params.idd },
      { name: 'id_master', sqltype: sql.Int, value: req.params.id },
      { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.params.idm },
    ];
    var query = "DELETE FROM Indikator_SatuanKerja WHERE id_periode = @id_periode and id_master = @id_master and id_satker = @id_satker";
    var cek = 1;
    executeQuery (res, query,cek,parameters)
  });
  return router
};
module.exports = routes; 