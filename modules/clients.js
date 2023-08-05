var mongo = require('mongodb');
const mysql = require('mysql');

var urlM = require('url');


    var jwt = require('jsonwebtoken');
exports.createUser = function(req,res){

    var method = req.method;
    var headers = req.headers;

    if (method === "POST") {
        if (headers['content-type'] === "application/json") {
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

                
               
                

                let email = requestBody.email;

                var con = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "touney"
                    });

                con.connect(function(err) {
                    if (err) throw err;
                    con.query("SELECT * FROM users WHERE email = ? ",[email], function (err, result) {
                      if (err) throw err;
                  

                      if (result.length == 0) {

                            // insert 
                            var sql = "INSERT INTO users (email,fullname, lastName, password) VALUES ?";
                            var values = [
                              [ requestBody.email,requestBody.fullname,requestBody.lastName, requestBody.password]
                            ];
                            con.query(sql, [values], function (err, result) {
                              if (err) throw err;


                              res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.write(JSON.stringify({ code:200 , success:true,message:"Compte créé avec succès."}));
                                
                                res.end();  
                                


                            });
                            
                            
               
                      } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ code:200 , success:false,message:"Cet email est déjà utilisé par un autre utilisateur."}));
                        
                        res.end();  
                      }




                     
                        

                    });





                  });
                


                    
                   
                    
                 



            });
        }else{
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ code: 200, message: "access denied.", success: false }));
            res.end();
        }
    }else{
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ code: 200, message: "access denied.", success: false }));
        res.end();
    }

}




exports.login = function (req,res){
    var method = req.method;
    var headers = req.headers;

    if (method === "POST") {
        if (headers['content-type'] === "application/json") {
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

                    console.log(requestBody);


                    const email = requestBody.email;
                    const password = requestBody.password;


                    var con = mysql.createConnection({
                        host: "localhost",
                        user: "root",
                        password: "",
                        database: "touney"
                        });
                    

                    con.connect(function(err) {
                        if (err) throw err;
                        con.query("SELECT * FROM users WHERE email = ? AND password  = ?",[email,password], function (err, result) {
                          if (err) throw err;
                      
    
                          if (result.length == 1) {

                            
                            var token = jwt.sign({ user: result[0],   exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), }, 'secretkey');

                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify({ success: true, token : token }));
                            res.end();



                          }else{
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify({ code: 200, message: "Mauvais email ou mot de passe, veuillez réessayer.", success: false }));
                            res.end();
                          }


                        })
                    })
                
    


                  



            });
        }else{
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ code: 200, message: "access denied.", success: false }));
            res.end();
        }
    }else{
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ code: 200, message: "access denied.", success: false }));
        res.end();
    }

}







exports.loginAdmin = function (req,res){
    var method = req.method;
    var headers = req.headers;

    if (method === "POST") {
        if (headers['content-type'] === "application/json") {
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

                    console.log(requestBody);


                    const email = requestBody.email;
                    const password = requestBody.password;
                    

                    var con = mysql.createConnection({
                        host: "localhost",
                        user: "root",
                        password: "",
                        database: "touney"
                        });

                    con.connect(function(err) {
                        if (err) throw err;
                        con.query("SELECT * FROM admins WHERE email = ? AND password  = ?",[email,password], function (err, result) {
                          if (err) throw err;
                      
    
                          if (result.length == 1) {

                            
                            var token = jwt.sign({ user: result[0],   exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), }, 'secretkey');

                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify({ success: true, token : token }));
                            res.end(); 

                          }else{
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify({ code: 200, message: "Mauvais email ou mot de passe, veuillez réessayer.", success: false }));
                            res.end();
                          }


                        })
                    })
                
    


                  



            });
        }else{
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ code: 200, message: "access denied.", success: false }));
            res.end();
        }
    }else{
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ code: 200, message: "access denied.", success: false }));
        res.end();
    }

}






exports.userInfo = function(req,res) {
    var method = req.method;
    var token = req.headers.authorization;
    var decoded = jwt.verify(token, 'secretkey');
    res.send({ success:true, user: decoded.user });
 
}







exports.getClientsList = function (req,res){
 
    
 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
    
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * from users",[], function (err, result) {
                if (err) throw err;
                
 
                res.send(result); 



            })
        }) 

}






exports.deleteClient = function (req,res){
 
 
 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "touney"
        });
   

        const id = urlM.parse(req.url,true).query.id;


        con.connect(function(err) {
            if (err) throw err;
            con.query("DELETE FROM users WHERE id= ?",[id], function (err, result) {
                if (err) throw err;
                 

                res.send({ success: true }); 



            })
        })

                    
                
    

 

}




