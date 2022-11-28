//socket.handshake.session
//Quand un client se connecte, on le note dans la consol
module.exports = (io,SpellContract,web3,pinata) => {
    io.sockets.on('connection',function(socket){

        socket.on('getGrimoire', async function(adresse){
                if(adresse!=undefined){
                    var links=[];
                    var numberOfSpell = await SpellContract.methods.getSpell_ID().call();
                    console.log(numberOfSpell);
                    console.log(adresse.toUpperCase());
        
                    for(var i=0;i<numberOfSpell;i++){
                        var link= await SpellContract.methods.ownerOf(i).call()
        
                        console.log(i + ' link : ' +link.toUpperCase() );
                        
                        if( link.toUpperCase() === adresse.toUpperCase()  ){
                            var tokenURI = await SpellContract.methods.tokenURI(i).call();
                            console.log(tokenURI);
                            links[links.length] = tokenURI;
                        }
                    }
                    console.log(links)
                    socket.emit('links',links);
                }else{
                    console.log("Used Adress Empty, please Connect Wallet")
                }
            });

        socket.on('getEnchanters', async function(){
            var accounts;
            await web3.eth.getAccounts().then(( bn )=> {
                //Mise a jour de la session
                accounts=bn;
                
            })
            socket.emit('accounts',accounts);
            console.table(accounts);
        })

        socket.on('createNFT', function(fromAdr,NFTObjet){

            //Load object and pin to IPFS api
            
            console.log( '\n\n\n NFT File : ' + NFTObjet.file + '\n\n\n');
            console.log( '\n\n\n NFT Object : ' + JSON.stringify(NFTObjet) + '\n\n\n');

            const body = {
                pinataMetadata: {
                    name: NFTObjet.SpellName
                },
                pinataContent: NFTObjet
            } ;
            
            pinata.pinJSONToIPFS(body).then((result) => {
                //handle results here
                var baseUrl = "https://gateway.pinata.cloud/ipfs/"
                var SpellURL = baseUrl + result.IpfsHash
                console.log( SpellURL );
                
                if(result.IpfsHash !== undefined){
                    SpellContract.methods.Spellcraft(SpellURL).send({
                        from : fromAdr,
                        gas : 5000000,
                        gasPrice : 200000000
                    }) ;

                    socket.emit('CraftedSpell', SpellURL  );
                }else{
                    //PINNING FAIL
                }
            }).catch((err) => {
                //handle error here
                console.log(err);
            });
        })
        
    })
}