const Web3          = require('web3');
const fs            = require('fs');
var express         =require('express');
var app             = express();
const PORT          =8080;
const options       = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
};

var credentials     = {key: options.key , cert: options.cert};
var server          =  require('https').createServer(credentials,app);
var io              = require('socket.io')(server);
var sharedsession   = require("express-socket.io-session");
var session         = require('express-session')({secret: "my-secret",resave: true,saveUninitialized: true});
var bodyParser      = require('body-parser');
const cookieParser  = require("cookie-parser");

const pinataSDK     = require('@pinata/sdk');
const pinata        = pinataSDK('2dc5098d55b4cc8d89dc', '1d9376a8ba92e82288fdfb7e6d0e8b749e2057315e1947c5c99045d987d85e31');

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log("Pinata API:  "+ JSON.stringify(result));
}).catch((err) => {
    //handle error here
    console.log("Pinata API:  "+err);
});

const web3 = new Web3("http://192.168.1.19:7545");
var accounts = "";

web3.eth.getBlockNumber().then(( bn )=> console.log(bn + '  WEB3 INITIALIAZED!!!'))
web3.eth.getAccounts().then(( bn )=> {accounts=bn;})
//-----------------------DECLARATIVE END -----------------------------//

//*******************BLOCKCHAIN SMCs AFFECTATION******/
var dataSpell       = require('./build/contracts/Spells.json');
var ABISpell        = dataSpell.abi;
var addressSpell    = dataSpell.networks[5777].address
var SpellContract   = new web3.eth.Contract(ABISpell,addressSpell);

var dataHello       = require('./build/contracts/Hello.json');
var ABIHello        = dataHello.abi;
var addressHello    = dataHello.networks[5777].address
var contract        = new web3.eth.Contract(ABIHello,addressHello);

var Enchant_Zeta = require('./build/contracts/Enchant_Zeta.json');
const { Socket } = require('socket.io');
var ABIEnchant_Zeta = Enchant_Zeta.abi;
var addressABIEnchant_Zeta = Enchant_Zeta.networks[5777].address
var Enchant_ZetaContract = new web3.eth.Contract(ABIEnchant_Zeta,addressABIEnchant_Zeta);

//-----------------------SERVER Configuration-----------------------------//
const oneDay = 1000 * 60 * 60 * 24;

app.use(session);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

io.use(sharedsession(session,{ autoSave : true }))

//--------------------SERVER ROUTES-------------------------/
app.get('/', (req, res) => {
    console.log("IN Get")
    if(req.session.connected){
        res.render(__dirname + '/public/views/index',{           
            connected:req.session.connected,
            enchanter:req.session.enchanter
        });
    }else{
        res.render(__dirname + '/public/views/index' )
    }
});
app.post('/',async (req, res) => {
    console.log("IN Get")
    if(req.session.connected){
        res.render(__dirname + '/public/views/index',{           
            connected:req.session.connected,
            enchanter:req.session.enchanter
        });
    }else{
        try{
            var isMessageSenderAnEnchanter = await Enchant_ZetaContract.methods.isMessageSenderAnEnchanter().call({from : req.body.address}) ;
            console.log(req.body.address +" : " + isMessageSenderAnEnchanter)
        }catch(e){
            console.log(e)
        }
        res.render(__dirname + '/public/views/index');
    }
});

app.get('/NFT', (req, res) => {
    res.render(__dirname + '/public/views/indexNFT');
});
app.get('/Token', (req, res) => {
    res.render(__dirname + '/public/views/indexToken');
});
app.get('/Grimoire', (req, res) => {
    res.render(__dirname + '/public/views/Grimoire');
});
app.get('/Enchanters', (req, res) => {
    if(req.session.connected){
        res.render(__dirname + '/public/views/Enchanters/Enchanters',{
            connected:req.session.connected,
            enchanter:req.session.enchanter
        });
    }else{
        res.render(__dirname + '/public/views/Enchanters/Enchanters');
    }
});
app.post('/LogOut', (req, res) => {
    console.log("IN LogOUT")
    req.session.destroy()
    res.render(__dirname + '/public/views/index');
});
app.get('/LogOut', (req, res) => {
    console.log("IN LogOUT")
    req.session.destroy()
    res.render(__dirname + '/public/views/index');
});
//-----SERVER VARIABLES----------------------/


//socket.handshake.session
//Quand un client se connecte, on le note dans la consol
require('./src/Enchanters')(io,Enchant_ZetaContract,web3,pinata,app);
require('./src/Spells')(io,SpellContract,web3,pinata);


server.listen(PORT);
console.log(`SERVER UP on : https://192.168.1.19:${PORT}/ `) ;