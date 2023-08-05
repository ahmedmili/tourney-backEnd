const mysql = require('mysql');
const urlM = require('url');


var jwt = require('jsonwebtoken');

exports.getPartnersList = function (req,res){
 
    
 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
    
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * from partners where state = 1",[], function (err, result) {
                if (err) throw err;
                
 
                res.send(result); 



            })
        }) 

}
exports.getPartnersListDemande = function (req,res){
 
    
 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
    
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * from partners where state = 0",[], function (err, result) {
                if (err) throw err;
                
 
                res.send(result); 



            })
        }) 

}

exports.searchForPartners = function (req,res){
 
    

    const params = urlM.parse(req.url,true).query;

    const region = params.region;
    const keywords = params.keywords;
    
 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
    
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM `partners`,`regions` WHERE partners.region_id = regions.id_region AND  partners.state = 1 AND partners.`region_id` = ? AND partners.name LIKE '%"+keywords+"%'",[region], function (err, result) {
                if (err) throw err;
                
 
                res.send(result); 
                



            })
        }) 

}

exports.searchForPartner = function (req,res){

    const params = urlM.parse(req.url,true).query; 
    const id = params.id;
    
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
    
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM `partners`,`regions` WHERE (partners.region_id = regions.id_region AND partners.`id` = ?  )",[id], function (err, result) {
                if (err) throw err;
                
 
                res.send(result[0]); 
                



            })
        }) 

}

exports.getRegionsList = function (req,res){

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
    
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * from regions",[], function (err, result) {
                if (err) throw err;
                
 
                res.send(result); 

            })
        }) 
}




exports.addNewPartner = function(req,res){
    let body = [];
            let requestBody = {};

            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                try {
                    requestBody = JSON.parse(body);
                } catch (err) {

                }

                var con = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "touney"
                    });

                con.connect(function(err) {
                    if (err) throw err;
                    
                            // insert 
                            var sql = "INSERT INTO `partners`( `name`, `logo_url`, `phone`, `email`, `website`, `maps`, `about`, `region_id`,`state`) VALUES  ?";
                            var values = [
                              [ 
                                    requestBody.name,
                                    requestBody.logo_url, 
                                    requestBody.phone,
                                    requestBody.email,
                                    requestBody.website, 
                                    requestBody.maps,
                                    requestBody.about,
                                    requestBody.region_id,
                                    0                       
                                ]
                            ];
                            con.query(sql, [values], function (err, result) {
                              if (err) throw err;

                              res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.write(JSON.stringify({ code:200 , success:true,message:"Partnenaire ajoutée avec succès."}));                       
                                res.end();  
                            });
                    });
                  });                   
}



exports.deletePartner = function(req,res){
    
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });

        const id = urlM.parse(req.url,true).query.id;
        con.connect(function(err) {
            if (err) throw err;
            con.query("DELETE FROM partners WHERE id= ?",[id], function (err, result) {
                if (err) throw err;
                res.send({ success: true }); 
            })
        })

                    
}

exports.AcceptPartner = function (req,res){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
        const id = urlM.parse(req.url,true).query.id;
        con.connect(function(err) {
            if (err) throw err;
            con.query("update partners SET state = 1 where id = ?",[id], function (err, result) {
                if (err) throw err;
                res.send(result); 
            })
        }) 
}





exports.addPartnerToMyCalendar = function(req,res){
    let body = [];
    let requestBody = {};

    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        try {
            requestBody = JSON.parse(body);
        } catch (err) {

        }

        let uid = null;
        const token = req.headers.authorization;
        var decoded = jwt.verify(token, 'secretkey');
      
        if (decoded != null) {
          uid = decoded.user.id;
        }

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "touney"
            });

        con.connect(function(err) {
            if (err) throw err;
            
                    // insert 
                    var sql = "INSERT INTO `users_calandar`( `user_id`, `partner_id`, `date`, `heure`, `more`) VALUES  ?";
                    var values = [
                      [ 
                            uid,
                            requestBody.partner_id, 
                            requestBody.date,
                            requestBody.heure,
                            requestBody.more
            
                        ]
                    ];
                    con.query(sql, [values], function (err, result) {
                      if (err) throw err;
                      res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ code:200 , success:true,message:"Service ajoutée avec succès a mon agenda."}));
                        res.end();  
                    });
            });
          });  
}

exports.getMyAgenda = function(req,res){

       let uid = null;
        const token = req.headers.authorization;
        var decoded = jwt.verify(token, 'secretkey');
      
        if (decoded != null) {
          uid = decoded.user.id;
        }
 
            var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "touney"
            });
            con.connect(function(err) {
                if (err) throw err;
                con.query("SELECT * FROM `users_calandar`,partners WHERE users_calandar.partner_id = partners.id AND  users_calandar.`user_id` = ?",[uid], function (err, result) {
                    if (err) throw err;
                    res.send(result); 
                })
            }) 
}

exports.deleteProgramFromCalendar = function(req,res){
    
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        }); 

        const id = urlM.parse(req.url,true).query.id; 

        con.connect(function(err) {
            if (err) throw err;
            con.query("DELETE FROM `users_calandar` WHERE `id_prog` = ?",[id], function (err, result) {
                if (err) throw err; 
                res.send({ success: true }); 
            })
        })                  
}
