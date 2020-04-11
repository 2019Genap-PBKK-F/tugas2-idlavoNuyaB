var express = require('express');
var app = express();
var http = require('http');
var datadasarController = require("./Controller/DataDasarController")(); 
var kategoriunitController = require("./Controller/KategoriUnitController")(); 
var unitController = require("./Controller/UnitController")();
var capaianunitController = require("./Controller/CapaianUnitController")();
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

//mahasiswa controller
app.use('/api/datadasar',datadasarController)
app.use('/api/kategoriunit',kategoriunitController)
app.use('/api/unit',unitController)
app.use('/api/capaianunit',capaianunitController)

var httpServer = http.createServer(app);
httpServer.listen(port,hostname);

