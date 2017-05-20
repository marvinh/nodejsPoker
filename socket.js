let app = require('http').createServer();
let io = require('socket.io')(app,{path: '/socket.io'});
app.listen(3000);
console.log("Listening for connection on port 3000");
let clientCount = 0;
var hands = new Array();
var turn = [1,0,0,0];
var round = 1;
var turnCount = 0;
userscore = [0,0,0,0];
var arr = ['1H','1D','1C','1S'
            ,'2H','2D','2C','2S'
            ,'3H','3D','3C','3S'
            ,'4H','4D','4C','4S'
            ,'5H','5D','5C','5S'
            ,'6H','6D','6C','6S'
            ,'7H','7D','7C','7S'
            ,'8H','8D','8C','8S',
            ,'9H','6D','6C','6S'
            ,'10H','10D','10C','10S'
            ,'JH','JD','JC','JS'
            ,'QH','QD','QC','QS'
            ,'KH','KD','KC','KS'];
let deck = arr.slice(); 

io.on('connection', function(socket){
    if(clientCount < 4){
    if(clientCount==0)
    {
        beginGame();
    }
    hands[clientCount] = dealin();
    clientCount++;
    console.log('Socket Connected');
    socket.emit('fromServer', {id: 'user_'+(clientCount),score: userscore[clientCount-1],hand: hands[clientCount-1], round:round, message: "User " + ((turnCount%clientCount)+1) +" turn"});

    socket.on('fromClient', function(data) { // listen for fromClient message

    if(data.id !=null){
    let id = data.id[5];
    id = (id -1);
    console.log('Received ' + data.id + ' from client');
    if(data.trash != null){
       if(turn[id]==1)
       {
        if(data.trash[0]!=-1)
        {
            for(var i = 0 ; i < data.trash.length; i++)
            {
                data.hand.splice(data.trash[i]);
            }
            for(var i = data.hand.length; i < 5; i ++)
            {
                data.hand.push(deck.pop());
            }
        }
    
       turn[id] = 0;
       turnCount++;
       turn[(id+1)%clientCount] = 1;
       hands[id] = data.hand;
       if(turnCount%clientCount == 0)
       {
           round++;
       }
       
       console.log(hands[id]);
       let index = id;
       socket.emit('fromServer', {id: 'user_'+(index+1),score: userscore[index],hand: hands[index],round:round,message:  "User " + ((turnCount%clientCount)+1) +" turn"});
       if(round >= 4)
       {
            determineWinner(socket);

       }

       }
    }
    }

   });

    }
    
});

function determineWinner(socket){
    socket.broadcast.emit('winner',{winner: 'TODO: Determine Winner Restarting Game'});
    deck = arr.slice();
    turn = [1,0,0,0];
    round = 1;
    turnCount = 0;
    beginGame();
    for(var i= 0; i < clientCount; i ++)
    {
        hands[i] = dealin();
    }
    socket.broadcast.emit('fromServer');
    

}



function beginGame(){

    deck.sort(function(a, b) {
        return (0.5 - Math.random()); // randomized return value
    });
    deck.pop();
    console.log(deck);
}
      

function dealin(){
        var temp = new Array();
        for(var j = 0; j < 5; j++)
        {
            temp.push(deck.pop());
        }
        return temp;
}





