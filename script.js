import popcorn from "https://jspm.dev/@popmotion/popcorn";
var firebaseConfig = {
    apiKey: "AIzaSyAljohaInhn7XVndpYnUfUlQoAI8T_fETw",
    authDomain: "websecp1-f23a0.firebaseapp.com",
    databaseURL: "https://websecp1-f23a0.firebaseio.com",
    projectId: "websecp1-f23a0",
    storageBucket: "websecp1-f23a0.appspot.com",
    messagingSenderId: "615127468111",
    appId: "1:615127468111:web:cb34e864c44738a976823a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let myDatabase = firebase.database();

var gameData = {one:0, two:0, three:0, four:0, five:0, six:0, seven:0, eight:0, nine:0};
let playerSign = "X";
let moveNum = 1;
let playing = true;
myDatabase.ref("running").on("value", ss=>{
  let status = ss.val();
  console.log("status: " + status);
    if (status == 1){
    myDatabase.ref("activeGame").on("value", ss=>{
      //console.log(ss.val());
      updateGame(ss.val());
      });
    } 
  if(status == 2){
    restart();
  }
});

let getNameInput = function(){
  $(".names").on("keyup", function(evt){ 
   // console.log("in on keyup");
    let answeredIndex = $(evt.currentTarget).attr("data-index");
    let newAnswer = $(evt.currentTarget).val();
    console.log(answeredIndex + " " + newAnswer);
    myDatabase.ref("database").child("currentNames").child("names").child(answeredIndex).set(newAnswer);
  });
}

getNameInput();

let setNameInput = function(){
  $("#endbutton").attr("disabled", true);
  document.getElementById("startbutton").addEventListener("click", function(){
    let user1 = document.getElementById("p1nameTextBox").value;
    let user2 = document.getElementById("p2nameTextBox").value;
    //let newClick = myDatabase.ref("database").child("test").push();
    let usersRef = myDatabase.ref("database").child("users");
    storeUsers(usersRef, user1);
    storeUsers(usersRef, user2);
    //myDatabase.ref("running").set(1);
    //updateGame(gameData)
    myDatabase.ref("activeGame").set(gameData);
    updateGame();
  });
}

setNameInput();

function storeUsers(usersRef, user){
  usersRef.child(user).set({
    user: user,
    highScore: 0
  });
}

let restart = function(){
  myDatabase.ref("running").set(0);
  $("#game").html(`
  <h1>TikTacToe</h1>
  <label id="p1name">Player 'X' Name:</label>
  <input id="p1nameTextBox">
  <label id="p2name">Player 'O' Name:</label>
  <input id="p2nameTextBox">
  <button id="startbutton">Start</button>
`);
  gameData = {one:0, two:0, three:0, four:0, five:0, six:0, seven:0, eight:0, nine:0};
  moveNum = 1;
  playerSign = "X";
  playing = true;
  myDatabase.ref("database").child("moves").remove();
  getNameInput();
  setNameInput();
  //codepen wont allow hard refresh
  document.location.reload(true);
}

$("#endbutton").click(function(){
  //myDatabase.ref("database").child("currentShots").child("shots").remove();
  myDatabase.ref("running").set(2);
  restart();
});


let showText = function(answerArray){
  //console.log("in showText");
  if (answerArray.length == 0){
    //showEmptyQuestions();
  }
  let numberOfAnswers = 0;
  for(let i=0; i < 2; i++){
    let answer = ""; 
    if (answerArray.hasOwnProperty(i)){
      answer = answerArray[i];
      $(`.names[data-index=${i}]`).val(answer);
    }
    if (answer.length > 0){
      numberOfAnswers += 1;
    }
  }
};

//console.log(myDatabase.ref("database").child("currentAnswers").child("names").val());
myDatabase.ref("database").child("currentNames").on("value", function(dataSnapshot){ 
  //console.log("in last function thing");
  //this function gets called every time the page is loaded AND when someone updates an answer
  //it's job is to draw the database values onto our screen
  let names = dataSnapshot.val();
  //console.log(names);
  if (names){
    showText(names.names); //show results
  }
});


myDatabase.ref("database").child("moves").on("value", ss => {
  //checkWin(ss.val());
  
  ss.forEach(function(childSnapShot){
    let moves = childSnapShot.val();
    console.log(moves);
    let target = moves.target;
    let player = moves.player;
    console.log("target: "+target+" player: "+player);
    $("#"+target+"").text(moves.player);
    //alert(target);
    switch(target){
      case "1":
        gameData.one = moves.player;
        //alert(gameData.one);
        break;
      case "2":
        gameData.two = moves.player;
        break;
      case "3":
        gameData.three = moves.player;
        break;
      case "4":
        gameData.four = moves.player;
        break;
      case "5":
        gameData.five = moves.player;
        break;
      case "6":
        gameData.six = moves.player;
        break;
      case "7":
        gameData.seven = moves.player;
        break;
      case "8":
        gameData.eight = moves.player;
        break;
      case "9":
        gameData.nine = moves.player;
        break;
      default:
        break;
    }
  });
});

let updateGame = function(remotegameData){
  $("#endbutton").attr("disabled", false);
  //gameData = remotegameData;
  playerSign = "X";
  myDatabase.ref("running").set(1);
  //let correct = gameData.correct || [];
  $("#game").html(`
  <br/>
<h2 id = "title">Player ${playerSign}'s turn</h2>
  <table id = "table" border = 1 >
    <tr>
      <td id=1></td>
      <td id=2></td>
      <td id=3></td>
    </tr>
    <tr>
      <td id=4></td>
      <td id=5></td>
      <td id=6></td>
    </tr>
    <tr>
      <td id=7></td>
      <td id=8></td>
      <td id=9></td>
    </tr>
  </table>
  `)
};

let changePlayer = function(){
  if(playerSign == "X"){
    playerSign = "O";
    //console.log("player sign changed form x to o");
  }
  else{
    playerSign = "X";
    //console.log("player sign changed form o to x");
  }
}


$("#game").on("click", function(e){
  let running = null;
  myDatabase.ref("running").once("value", function(dataSnapshot){
    running = dataSnapshot.val();
  });
  let temp = playerSign;
  if(running == 1 && e.target.id != "game" && e.target.id != "startbutton"){
    let bool = checkValidMove(e);
    console.log(bool);
    if(bool != false){
      $("#"+e.target.id+"").text(temp);
      //checkWin(temp);
      //playerSign = changePlayer();
      myDatabase.ref("database").child("moves").child(e.target.id).set({
        target: e.target.id,
        player: temp,
        moveNum: moveNum
      });
      checkWin(playerSign);
      moveNum += 1;
      changePlayer();
      $("#title").text(`Player ${playerSign}'s turn`);
      //console.log("Player " + playerSign + "'s turn");
    } else if(bool == false && playing == true){
      alert("pick a different spot");
    }
  } 
});

let checkValidMove = function(e){
  let temp = null;
  if(playing == true){
    myDatabase.ref("database").child("moves").once("value", ss =>{
      if(ss.hasChild(e.target.id)){
        temp = false;
      } else {
        temp = true;
      }
    });
  } else {
    alert("The game is over");
    temp = false;
  }
  return temp;
}

let checkWin = function(player){
  console.log("in checkwin");
  if(gameData.one == player && gameData.two == player && gameData.three == player){
    alert("you won");
    playing = false;
  } else if(gameData.one == player && gameData.four == player && gameData.seven == player){
    alert("you won");
    playing = false;
  } else if(gameData.two == player && gameData.five == player && gameData.eight == player){
    alert("you won");
    playing = false;
  } else if(gameData.three == player && gameData.six == player && gameData.nine == player){
    alert("you won");
    playing = false;
  } else if(gameData.one == player && gameData.five == player && gameData.nine == player){
    alert("you won");
    playing = false;
  } else if(gameData.three == player && gameData.five == player && gameData.seven == player){
    alert("you won");
    playing = false;
  }
  //alert(gameData.one);
}
