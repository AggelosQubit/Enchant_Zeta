//socket.handshake.session
//Quand un client se connecte, on le note dans la consol
module.exports = (io,Enchant_ZetaContract,web3,pinata,app) => {
    io.sockets.on('connection',function(socket){
        socket.on('getEnchant_id',async function(){
            await Enchant_ZetaContract.methods.getEnchant_id().call(
                (err,res) => {
                    if(err){
                        console.log(err);
                    } else {
                        result= res; 
                        console.log("in getEnchant_id : "+result);
                    }
                }
            );
        })
    })

    app.post('/Enchanters', async (req,res)=>{
        console.log("IN POST Enchanters"+  req.session.connected)
        console.log(req.body.Denomination,req.body.Deity,req.body.email,req.body.address)

        if( (req.body.Denomination)===""    || (req.body.Denomination) === undefined  )
        {return "Not Post Entry For Account Creation";}
        if( (req.body.Deity)===""           || (req.body.Deity) === undefined )
        {return "Not Post Entry For Account Creation";}
        if( (req.body.email)===""           || (req.body.email) === undefined )
        {return "Not Post Entry For Account Creation";}

        var enchanter = {
            "Denomination" : req.body.Denomination,
            "Deity":req.body.Deity,
            "email":req.body.email,
            "address":req.body.address
        }
        var isMessageSenderAnEnchanter = await Enchant_ZetaContract.methods.isMessageSenderAnEnchanter().call(
            (err,res) => {
                if(err){
                    console.log(err);
                } else {
                    result= res; 
                    //socket.emit('isEnchanter',result)
                }
            }
        );
        console.log("isMessageSenderAnEnchanter : "+isMessageSenderAnEnchanter);
        if(!isMessageSenderAnEnchanter){
            console.log("CREER UN NOUVEL ENCHANTEUR");
            var Ascente  = await Enchant_ZetaContract.methods
            .Ascension(req.body.email,req.body.Denomination,req.body.Deity)
            .call({
                    from : req.body.address, 
                    gas : 5000000,
                    gasPrice : 21000
                },(err,res) => {
                    if(err){
                        console.log(err);
                    } else {
                        result= res; 
                        console.log("no err : " +result)
                        //socket.emit('isEnchanter',result)
                    }
                })
            console.log("Ascente : " + Ascente)
            console.log(await Enchant_ZetaContract.methods.getEnchant_id().call())
            req.session.enchanter=enchanter;
            req.session.connected=true;
            res.render(__dirname + '\\..\\public\\views\\index', {
                connected: req.session.connected,
                enchanter:enchanter
            }  );
        }else{
            res.render(__dirname + '\\..\\public\\views\\index',{
                    message:"Use the Scan button!"
            });
        }
    })
}