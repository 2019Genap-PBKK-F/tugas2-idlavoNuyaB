var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var https = require('https');
var datadasarController = require("./Controller/DataDasarController")(); 
var indikatorSatkerController = require("./Controller/IndikatorSatuanKerjaController")(); 
var indikatorSatker_logController = require("./Controller/IndikatorSatuanKerja_LogController")();
var indikatorPeriodeController = require("./Controller/IndikatorPeriodeController")();
var periodeController = require("./Controller/PeriodeController")();
var masterindikatorController = require("./Controller/MasterIndikatorController")();
var jenisSatkerController = require("./Controller/JenisSatkerController")();
var SatkerController = require("./Controller/SatuanKerjaController")();
var capaianunitController = require("./Controller/CapaianUnitController")();
var aspekController = require("./Controller/AspekController")();
var dosenController = require("./Controller/DosenController")();
var abmasController = require("./Controller/AbmasController")();
var penelitianController = require("./Controller/PenelitianController")();
var publikasiController = require("./Controller/PublikasiController")();
var loginController = require("./Controller/LoginController")();
var konkinController = require("./Controller/KonkinController")();
const hostname = '10.199.14.46';
const port = 8017;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.use('/api/datadasar',datadasarController);
app.use('/api/indikatorsatker',indikatorSatkerController);
app.use('/api/indikatorperiode',indikatorPeriodeController);
app.use('/api/indikatorsatkerlog',indikatorSatker_logController);
app.use('/api/periode',periodeController);
app.use('/api/masterindikator',masterindikatorController);
app.use('/api/jenissatker',jenisSatkerController);
app.use('/api/satker',SatkerController);
app.use('/api/capaianunit',capaianunitController);
app.use('/api/aspek',aspekController);
app.use('/api/dosen',dosenController);
app.use('/api/abmas',abmasController);
app.use('/api/penelitian',penelitianController);
app.use('/api/publikasi',publikasiController);
app.use('/api/login',loginController);
app.use('/api/konkin',konkinController);

var options = {
  key: fs.readFileSync(__dirname+'/server,key'),
  cert: fs.readFileSync(__dirname+'/server.crt')
};

var httpsServer = https.createServer(options,app)
httpsServer.listen(port,hostname);
// var httpServer = http.createServer(app);
// httpServer.listen(port,hostname);

