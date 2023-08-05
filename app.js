const express = require('express');
const app = express();
const port = 8080;

    var jwt = require('jsonwebtoken');

const urlM = require('url');
var clients = require('./modules/clients'); 

var cors = require('cors');
const {getPartnersListDemande, getPartnersList, getRegionsList,AcceptPartner, addNewPartner, deletePartner, searchForPartners, searchForPartner, addPartnerToMyCalendar, getMyAgenda, deleteProgramFromCalendar } = require('./modules/partners');




app.use(cors());

app.use(function(req,res,next){
  const path  = urlM.parse(req.url,true).pathname;

  if ( path.indexOf('/api/auth') != -1 ) {
    next();
  } else {

    const token = req.headers.authorization;

    if (token != null) {
        
    try {
      var decoded = jwt.verify(token, 'secretkey');
      
      if (decoded != null) {
        next();
      }
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify({ success: true, message : 'session expiré' }));
                            res.end();
                            

    }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ success: true, message : 'accées refusé' }));
      res.end();
    }


  
  }
})

app.use(express.static('public'));
  
app.get('/', (req, res) => res.send('Hello World!'));



app.post('/api/auth/create-account', (req, res) => {
    clients.createUser(req,res);
});


app.post('/api/auth/signin', (req, res) => {
  clients.login(req,res);
});


app.post('/api/auth/admin/signin', (req, res) => {
  clients.loginAdmin(req,res);
});


app.get('/api/userinfo',(req, res) => {
  clients.userInfo(req,res);
});


app.get('/api/partners/list',(req, res) => {
  getPartnersList(req,res);
  
});

app.get('/api/partners/list-demande',(req, res) => {
  getPartnersListDemande(req,res);
  
});

app.put('/api/partners-accept', (req, res) => {
  // console.log(req.headers.authorization)
  AcceptPartner(req,res);
});

app.post('/api/partners/add',(req, res) => {

  addNewPartner(req,res);
});

app.delete('/api/partners/delete',(req, res) => {

  deletePartner(req,res);
});


app.get('/api/regions/list',(req, res) => {
  getRegionsList(req,res);
  
});

app.get('/api/partners/list/search',(req, res) => {
  searchForPartners(req,res);
  
});



app.get('/api/partners/details',(req, res) => {
  searchForPartner(req,res);
  
});



app.post('/api/calendar/add',(req, res) => {
  addPartnerToMyCalendar(req,res);
 
});



app.get('/api/calendar/get-my-agenda',(req, res) => {
  getMyAgenda(req,res);
 
});

app.get('/api/calendar/delete-program',(req, res) => {
  deleteProgramFromCalendar(req,res); 
});












/*** admin */



app.get('/api/clients/list',(req, res) => {
  clients.getClientsList(req,res);
});


app.delete('/api/clients/delete',(req, res) => {
  clients.deleteClient(req,res);
});










app.listen(port, () => console.log(`CelebraEvents is listening at http://localhost:${port}`))