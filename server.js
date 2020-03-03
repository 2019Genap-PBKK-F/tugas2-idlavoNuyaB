var express = require('express');
var app = express();
var sql = require("mssql");
var http = require('http');
const hostname = '10.199.14.46';
const port = 8017;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

// config for your database
var config = {
  user: 'su',
  password: 'SaSa1212',
  server: '10.199.13.253', 
  database: 'nrp05111740000085'
};

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
//mahasiswa controller
app.get('/api/mahasiswa', function (req, res) {   
    var query = 'Select * from Mahasiswa';
    var cek = 0;
    var parameters;
    executeQuery(res,query,cek,parameters);
});

app.get('/api/mahasiswa/:id', function (req, res) {   
  var cek = 2;
  var parameters;
  var query = "Select * from Mahasiswa WHERE id = " + req.params.id;
  executeQuery(res,query,cek,parameters);
});

app.post('/api/mahasiswa', function(req,res){
  var cek = 1;
  var parameters = [
    { name: 'id', sqltype: sql.Int, value: req.body.id},
    { name: 'nama', sqltype: sql.VarChar(50), value: req.body.nama},
    { name: 'nrp', sqltype: sql.Char(14), value: req.body.nrp},
    { name: 'angkatan', sqltype: sql.Char(4), value: req.body.angkatan},
    { name: 'jeniskelamin', sqltype: sql.Char(9), value: req.body.jeniskelamin},
    { name: 'tgllahir', sqltype: sql.Char(10), value: req.body.tgllahir},
    { name: 'photo', sqltype: sql.VarChar, value: req.body.photo},
    { name: 'aktif', sqltype: sql.Bit, value: req.body.aktif}
  ];
  var query = 'INSERT INTO Mahasiswa(id,nrp,nama,angkatan,jeniskelamin,tgllahir,photo,aktif) VALUES (@id,@nrp,@nama,@angkatan,@jeniskelamin,@tgllahir,@photo,@aktif)';
  executeQuery(res,query,cek,parameters);
});

app.put('/api/mahasiswa/:id',function(req,res){
  var cek = 1;
  var parameters = [
    { name: 'id', sqltype: sql.Int, value: req.params.id},
    { name: 'nama', sqltype: sql.VarChar(50), value: req.body.nama},
    { name: 'nrp', sqltype: sql.Char(14), value: req.body.nrp},
    { name: 'angkatan', sqltype: sql.Char(4), value: req.body.angkatan},
    { name: 'jeniskelamin', sqltype: sql.Char(9), value: req.body.jeniskelamin},
    { name: 'tgllahir', sqltype: sql.Char(10), value: req.body.tgllahir},
    { name: 'photo', sqltype: sql.VarChar, value: req.body.photo},
    { name: 'aktif', sqltype: sql.Bit, value: req.body.aktif}
  ];
  var query = "UPDATE Mahasiswa SET nama = @nama, nrp = @nrp, angkatan = @angkatan, jeniskelamin = @jeniskelamin, tgllahir = @tgllahir, photo = @photo, aktif = @aktif WHERE id = @id";
  executeQuery(res,query,cek,parameters);
});

app.delete('/api/mahasiswa/:id',function(req,res){
  var query = "DELETE FROM mahasiswa WHERE Id=" + req.params.id;
  var parameters;
  var cek = 2;
  executeQuery (res, query,cek,parameters);
});

var httpServer = http.createServer(app);
httpServer.listen(port,hostname);

// var server = app.listen(port, function () {
//     console.log(`Server is running..at http://${hostname}:${port}/`);
// });