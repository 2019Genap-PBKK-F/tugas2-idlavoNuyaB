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
    if(cek == 0){
      parameters.forEach(function(p){
        request.input(p.name,p.sqltype,p.value);
      });
    }
    // query to the database and get the records
    request.query(query, function (err, recordset) {
        if (err) console.log(err)
        // send records as a respons
        res.send(recordset.recordset);
        sql.close();
    });
  });
}

var routes = function(){
  router.route('/').get(function(req,res){
    var query = 'Select Aspek.aspek as Aspek, Aspek.komponen_aspek as [Komponen Aspek],' +
    'MasterIndikator.nama as [Indikator Kinerja],Indikator_SatuanKerja.bobot as Bobot,' +
    'Indikator_SatuanKerja.target as Target,Indikator_SatuanKerja.capaian as Capaian,' +
    'SatuanKerja.nama as Satuan from ((MasterIndikator INNER JOIN Indikator_SatuanKerja ON' +
    'Indikator_Satuankerja.id_master = MasterIndikator.id) INNER JOIN Aspek ON Aspek.id = '+
    'MasterIndikator.id_aspek) INNER JOIN SatuanKerja ON Indikator_SatuanKerja.id_satker = SatuanKerja.id';
    executeQuery(res,query,0,0);
  });
  return router
};
module.exports = routes; 