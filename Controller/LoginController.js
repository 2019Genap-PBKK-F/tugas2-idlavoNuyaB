var express = require('express');
var router = express.Router();
var sql = require("mssql");
var jwt = require('jsonwebtoken');
var config = require("../Connection/config");

var secret = 'MIICWwIBAAKBgQDdlatRjRjogo3WojgGHFHYLugdUWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQsHUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5Do2kQ+X5xK9cipRgEKwIDAQABAoGAD+onAtVye4ic7VR7V50DF9bOnwRwNXrARcDhq9LWNRrRGElESYYTQ6EbatXS3MCyjjX2eMhu/aF5YhXBwkppwxg+EOmXeh+MzL7Zh284OuPbkglAaGhV9bb6/5CpuGb1esyPbYW+Ty2PC0GSZfIXkXs76jXAu9TOBvD0ybc2YlkCQQDywg2R/7t3Q2OE2+yo382CLJdrlSLVROWKwb4tb2PjhY4XAwV8d1vy0RenxTB+K5Mu57uVSTHtrMK0GAtFr833AkEA6avx20OHo61Yela/4k5kQDtjEf1N0LfI+BcWZtxsS3jDM3i1Hp0KSu5rsCPb8acJo5RO26gGVrfAsDcIXKC+bQJAZZ2XIpsitLyPpuiMOvBbzPavd4gY6Z8KWrfYzJoI/Q9FuBo6rKwl4BFoToD7WIUS+hpkagwWiz+6zLoX1dbOZwJACmH5fSSjAkLRi54PKJ8TFUeOP15h9sQzydI8zJU+upvDEKZsZc/UhT/SySDOxQ4G/523Y0sz/OZtSWcol/UMgQJALesy++GdvoIDLfJX5GBQpuFgFenRiRDabxrE9MNUZ2aPFaFp+DyAe+b4nDwuJaW2LURbr8AEZga7oQj0uYxcYw==';

var executeQuery = function(req,res,query,cek,parameters){
  // connect to your database
  var user;
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
        if (err) {
            console.log(err)
            res.status(500).send('Error in server')
        }
        // send records as a respons
        if(cek == 1) {
            user = recordset.recordset;
            console.log(user[0])
            console.log(req.body)
            if(user[0] == undefined && req.body.username == '')return res.send({error: 'User Invalid & Password Invalid'})
            if(!user[0]) return res.send({error : 'User Invalid'});
            if(req.body.password != user[0].password) return res.send({error : 'Password Invalid'});
            var token = jwt.sign({ id: user.id }, secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({token: token, user: user });
        }
        if(cek == 0) res.send(recordset.recordset);
        sql.close(); 
    });
  });

}

var routes = function(){
  router.route('/').get(function(req,res){
    var query = 'Select id, email as username, email as password, id_induk_satker from SatuanKerja';
    executeQuery(0,res,query,0,0);
  });
  router.route('/').post(function(req,res){
    var parameters = [
        { name: 'username', sqltype: sql.VarChar(255), value: req.body.username},
        { name: 'password', sqltype: sql.VarChar(255), value: req.body.password}
    ];
    var query = "Select id, email as username, email as password, id_induk_satker from SatuanKerja where email = @username";
    executeQuery(req,res,query,1,parameters);
  });
  return router
};
module.exports = routes; 