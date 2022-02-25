//Função ler dispositivos
ler()
function ler(){

var mqtt = require('mqtt')    
var mqttAddress = "mqtt://localhost:1883" 
var client = mqtt.connect(mqttAddress)



    client.on('connect', function () {
        
        
        client.subscribe("zigbee2mqtt/Interruptor") 
        client.subscribe("zigbee2mqtt/Interruptor vazio")          
        client.subscribe("zigbee2mqtt/Relay8ch")
        client.subscribe("zigbee2mqtt/Cortina")
        
    })
        client.on('message', function (topic, message){
            
            const i = JSON.parse(message)             


            if(i.action === 'single' && i.device.friendlyName === 'Interruptor'){
                var a = { 
                    query : 
                    {
                    id : "state_l1",
                    value : "ON",
                    ver : true
                    }                           
                }
                var b = { 
                    query : 
                    {
                    id : "state_l2",
                    value : "ON",
                    ver : true 
                    }                           
                    
                }
                
                defineTurn(b)
                return defineTurn(a)
            }
            if(i.action === 'hold' && i.device.friendlyName === 'Interruptor'){
                var a = { 
                    query : 
                    {
                    id : "state_l1",
                    value : "OFF",
                    ver : true
                    }               
                }
                var b = { 
                    query : 
                    {
                    id : "state_l2",
                    value : "OFF",
                    ver : true 
                    }                           
                    
                }
                defineTurn(b)
                return defineTurn(a)
            }
            if(i.action === 'single' && i.device.friendlyName === 'Interruptor vazio'){
                var a = { 
                    query : 
                    {
                    id : "state_l1",
                    value : "ON",
                    ver : true
                    }               
                }
                return defineTurn(a)
            }
            if(i.action === 'double' && i.device.friendlyName === 'Interruptor vazio'){
                var a = { 
                    query : 
                    {
                    id : "state_l1",
                    value : "OFF",
                    ver : true
                    }               
                }
                return defineTurn(a)
            }
            
            }) 

            
            
}

//Define status
function escreveArquivo(req){

  var i = 0 
  var a = require('../logs/status.json') 
  
    //Variavel auxiliar para mudar arquivo
    var aux = a           
    

    for(i = 0; i <= aux.length; i++){             

            if(aux[i] === undefined){

                aux.push(req)

                var fs = require('fs')

                    const data = JSON.stringify(aux)
                    fs.writeFile('./logs/status.json', data, err => {
                        if(err) throw err;
                        
                        console.log("Status foi alterado !!");
                    })
                    return console.log('Novo item')  

            }else if(aux[i][0].id === req[0].id){
            
                aux[i] = req
                
                var fs = require('fs')

                const data = JSON.stringify(aux)
                fs.writeFile('./logs/status.json', data, err => {
                    if(err) throw err;
                    
                    console.log("Status foi alterado !!");
                })
                return console.log('É igual/atualizado')
                
            } 
        
    }


}

//Função para arquivo type
function escreveType(req, res){

var mqtt = require('mqtt')    
var mqttAddress = "mqtt://localhost:1883" 
var client = mqtt.connect(mqttAddress)
var a = []
 
    client.on('connect', function () {

        client.subscribe("zigbee2mqtt/bridge/devices")

    })
     client.on('message', function (topic, message){
            
            const i = JSON.parse(message)                                

               //Definindo type dos id's
               for(var g = 1; g < i.length; g++){                     
                
                    if(i[g].definition.exposes[0].type != 'numeric'){

                        a.push ({
                            name: i[g].friendly_name,
                            id: i[g].ieee_address,
                            type: i[g].definition.exposes[0].type
                        })

                    }
                    

                } 
                console.log(a)

                                    
                var fs = require('fs')

                const data = JSON.stringify(a)
                fs.writeFile('./logs/type.json', data, err => {
                    if(err) throw err;
                    
                    console.log("Type foi alterado");
                })

                return res.json({message: 'arquivo type foi escrito'})

    })                 


}


//Função define o status
function status(req, res){  

var mqtt = require('mqtt')    
var mqttAddress = "mqtt://localhost:1883" 
var client = mqtt.connect(mqttAddress)
var board = require('../src/board.json')
var a = require('../logs/type.json')
var b = []

var status = require('../logs/status.json')


//Leitura status    
for(var r = 0; r < status.length; r++){
    if(req.query.id === status[r][0].id){
        return res.json(status[r][0])
    }
}  

                //Leitura board
                var confereb = false
                var nameb 
                var idb
                for(var j = 0; j < board.length; j++){
                    if(req.query.id == board[j].id){
                        confereb = true
                        nameb = board[j].value
                        idb = board[j].id
                    }
                }

                
                //Leitura arquivo on/off e validação
                var count = 0;
                for(var f = 0; f < a.length; f++){
                
                count++;    
                if(req.query.id == a[f].id){

                        if(a[f].type == 'cover'){
                            b.push ({
                                id: req.query.id,
                                name: a[f].name,
                                status: 'STOP'
                            })
                            
                            escreveArquivo(b)
                            return res.json(b)

                            
                        }else if(a[f].type == 'light'){
                            b.push ({
                                id: req.query.id,
                                name: a[f].name,
                                status: 'OFF',
                                color: null,
                                light: null
                            })
                            
                            escreveArquivo(b)
                            return res.json(b)

                        
                        }else{
                            return res.json({message: 'Não é do tipo cadastrado'})
                        }

                    }
                
                    if(confereb == true){
                        b.push ({
                            id: idb,
                            name: nameb,
                            status: 'OFF'
                        }) 

                        
                        escreveArquivo(b)
                        return res.json(b) 
                    }                 
                                            
                }
                    if(count == a.length){
                        return res.json({message: 'Não é acionamento'})
                    }                      

             
}

//função estado dispositivo
function defineState(req, res){
    var mqtt = require('mqtt') 
    var mqttAddress = "mqtt://localhost:1883"  
    var client = mqtt.connect(mqttAddress)
    var a = require('../logs/type.json')

    //Função para o light
    function escrevelight(id, mud, inf){
    var status = require('../logs/status.json')
    var json = []

    for(var rep = 0; rep < status.length; rep++){

        if(id === status[rep][0].id && mud === 'color'){

            json.push({
                id: id,
                name: status[rep][0].name,
                status: status[rep][0].status,
                color: inf,
                light: status[rep][0].light
            })
            escreveArquivo(json)

        }
        if(id === status[rep][0].id && mud === 'brightness'){

            json.push({
                id: id,
                name: status[rep][0].name,
                status: status[rep][0].status,
                color: status[rep][0].color,
                light: inf
            })
            escreveArquivo(json)

        }

    }

}

    //Variaveis utilitarias
    var type = 'undefined'
    var escreve = []
    
   
    //Json dos dispositivos
    var receiveId = req.query.id
    var receiveLight = req.query.light
    var receiveColor = req.query.color


     //Verificação de tipos
     for(var j = 0; j < a.length; j++){            
        if((a[j].id === receiveId) && (a[j].type === 'light')){                
            
            type = 'light'                

        }
     }
    
        //Tipo light
        if(type === 'light' && receiveColor != null){

            var opt = 'color'
            var def = 'zigbee2mqtt/' + receiveId + '/set/'

            client.on('connect', (topic, message) =>{
                        
                
                topic = def
                message = receiveColor
                client.publish(topic, message);

                escrevelight(receiveId, opt, receiveColor)
            })
            
            return res.json({color: 'Foi alterada'})
        }else if(type === 'light' && receiveLight != null){

            var opt = 'brightness'
            var def = 'zigbee2mqtt/' + receiveId + '/set/' + 'brightness'

            client.on('connect', (topic, message) =>{
                                
                topic = def
                message = receiveLight
                client.publish(topic, message);
                escrevelight(receiveId, opt, receiveLight)
            })

            return res.json({light: receiveLight})
        }else{
            return res.json({message: 'Falta informação'})
        }
     
    

}

//Função ligar e desligar
 function defineTurn(req, res){
    var mqtt = require('mqtt') 
    var mqttAddress = "mqtt://localhost:1883"  
    var client = mqtt.connect(mqttAddress)
    var board = require('./board.json')
    var valida = require('../logs/log.json')
    var validaId = false
    var validaValue = false
    var idenBo = false

    //Json usados para ligar e desligar   
    var idenCo = req.query.ver
    var receiveId = req.query.id
    var receiveValue = req.query.value

                function escreveonoff(id, inf){
                    var status = require('../logs/status.json')
                    var json = []
            
                    for(var rep = 0; rep < status.length; rep++){
            
                        if(id === status[rep][0].id){
            
                            json.push({
                                id: id,
                                name: status[rep][0].name,
                                status: inf,
                            })
                            escreveArquivo(json)
            
                        }
            
                    }
            
                }

    
    //Valida id e value
    for(var j = 0; j < valida.length; j++){
        if(receiveId == valida[j].id){
            validaId = true
        }
    }
    if(receiveValue == "ON"){
        validaValue = true
    }
    if(receiveValue == "OFF"){
        validaValue = true
    }
    if(receiveValue == "on"){
        validaValue = true
    }
    if(receiveValue == "off"){
        validaValue = true
    }
    if(receiveValue == "CLOSE"){
        validaValue = true
    }
    if(receiveValue == "OPEN"){
        validaValue = true
    }
    if(receiveValue == "STOP"){
        validaValue = true
    }
   
    //Idenficada a board
    for(var i = 0; i <= 7; i++){//Mudar para board.length
        if(receiveId == board[i].id){
            idenBo = true
        }
    }   
    
    //Validações para gets e posts, falta validar leitura
    if(validaValue == false && validaId == false){
        return res.json({message: 'Id e Value invalido !', valida: false})
        }else if(validaValue == false && idenCo == true){//Caso erre
            console.log("Value está errado !")
            return 0

            }else if(validaId == false && idenCo == true){
                console.log("Id está errado !")
                return 0

                }else if(validaValue == false){
                    return res.json({message: 'Value invalido !', valida: false})

                    }else if(validaId == false){
                        return res.json({message: 'Id invalido !', valida: false})

                        }else if(idenBo == true && idenCo == true){//Para os gets
                            var apc = 'zigbee2mqtt/' + 'Relay8ch' + '/set/' + receiveId + ''

                            client.on('connect', (topic, message) =>{
                                
                                topic = apc
                                message = receiveValue
                                client.publish(topic, message);
                                escreveonoff(receiveId, receiveValue)
                            })
                            return 0;
                                }else if(idenCo == true){
                                    client.on('connect', (topic, message) =>{
                                        var cpc = 'zigbee2mqtt/' + receiveId + '/set/' + 'state' + ''

                                        topic = cpc
                                        message = receiveValue
                                        client.publish(topic, message);
                                        escreveonoff(receiveId, receiveValue)
                                    })
                                    return 0;
                                        }else if(idenBo == true){//Para os posts  
                                            client.on('connect', (topic, message) =>{
                                                var apc = 'zigbee2mqtt/' + 'Relay8ch' + '/set/' + receiveId + ''
                                                

                                                topic = apc
                                                message = receiveValue
                                                client.publish(topic, message);
                                                escreveonoff(receiveId, receiveValue)
                                            })
                                            return res.json({message: 'Ok ' + receiveId + ', ' + receiveValue, valida: true})
                                                }else{
                                                    client.on('connect', (topic, message) =>{
                                                        var cpc = 'zigbee2mqtt/' + receiveId + '/set/' + 'state' + ''
                                                        
                                                        
                                                        topic = cpc
                                                        message = receiveValue
                                                        client.publish(topic, message);
                                                        escreveonoff(receiveId, receiveValue)
                                                    })
                                                    return res.json({message: 'Ok ' + receiveId + ', ' + receiveValue, valida: true})
                                                }

    
}

//Função listar dispositivos
async function listDevices(req, res){
    var mqtt = require('mqtt') 
    var mqttAddress = "mqtt://localhost:1883" 
    var client = mqtt.connect(mqttAddress)
    var board = require('./board.json')
    var cont = 0; 

    client.on('connect', function () {
        client.subscribe("zigbee2mqtt/bridge/devices")
      })

      client.on('message', function (topic, message){ 
      
       
        let x = JSON.parse(message)
        let mapear = x.map(valor => {            
           
            if((valor.ieee_address == '0x00124b00234d61b8') || (valor.ieee_address == '0x00124b00234d61de')){
            cont++
            }else{  
                let rObj = {
                    id: valor.ieee_address,
                    value:  valor.friendly_name
                }  
            cont++
            return rObj 
            } 
         })
         
         //Depuração da matriz
         for(var j = 0; j <= 7; j++){
         mapear[cont] = board[j]
         cont++
         }

         var filtroM = mapear.filter(function (el) {
            return el != null
          })

          //Testando trecho para listar todos os status
            var arqStatus = require('../logs/status.json')

            //Matriz
            for(var y = 0; y < filtroM.length; y++){

                for(var z = 0; z < arqStatus.length; z++){

                    if(filtroM[y].id === arqStatus[z][0].id){                                                                   
                        
                        filtroM[y].status = arqStatus[z][0].status

                    }
                }
            }

            //Escreve arquivo log.json
            var fs = require('fs')
            const data = JSON.stringify(filtroM)
            fs.writeFile('./logs/log.json', data, err => {
                if(err) throw err;
                
                console.log("Log foi alterado !!");
            }) 
        

         return res.json(filtroM)        
   }) 
}

//Função habilita e desabilita dispositivos
function join(){
    var mqtt = require('mqtt') 
    var mqttAddress = "mqtt://localhost:1883" 
    var client = mqtt.connect(mqttAddress)
    
        
        client.on('connect', (topic, message) =>{
            message = '{"value":"true"}';
            client.publish('zigbee2mqtt/bridge/request/permit_join', message); 
            console.log("Aguardando dispositivos para entrar")            
        })
}
function unJoin(){
    var mqtt = require('mqtt') 
    var mqttAddress = "mqtt://localhost:1883" 
    var client = mqtt.connect(mqttAddress)
    
        
        client.on('connect', (topic, message) =>{
            message = '{"value":"false"}';
            client.publish('zigbee2mqtt/bridge/request/permit_join', message); 
            console.log("Entrada de dispositivos fechada")            
        })
}


// Função renomear
function rename(req, res){
    var mqtt = require('mqtt') 
    var mqttAddress = "mqtt://localhost:1883" 
    var client = mqtt.connect(mqttAddress)               
    
    var receiveId = req.body.id
    var receiveValue = req.body.value
    
    var mensagem = '{"from" : ' + '"' + receiveId + '"' + ', "to" : ' + '"' + receiveValue + '"' + '}'

        client.on('connect', (topic, message) =>{
            message = mensagem
            client.publish('zigbee2mqtt/bridge/request/device/rename', message); 
            console.log("Nome foi alterado")             
        })

    return res.json({message: "Resposta renomear"})
}

module.exports = { defineTurn, listDevices, join, unJoin, rename, status, defineState, escreveType }
