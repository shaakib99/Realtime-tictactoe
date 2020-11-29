let player = null;
let matrix = null;
let maxGameId = 100000;
const host = 'https://tictactoe-game-basic.herokuapp.com/'
window.onload = ()=>{
    let gameId = document.getElementById('game-id').value;
    player = gameId === 'None' ? 0 : 1;
    gameId = player === 0 ? showgeneratedGameId() : gameId
    
    // listen for click on the multiplayer button
    const multiplayerButton = document.getElementById('multiplayer-button')
    player == 1 ? 
            handleMultiplayerEvent(gameId,player)
            : multiplayerButton.addEventListener('click', ()=> handleMultiplayerEvent(gameId,player))
    
    const playwithbotButton = document.getElementById('bot-button')
    playwithbotButton.addEventListener('click',()=>playWithBotEventHandlers())
    const gotoHomeButton = document.getElementsByClassName('gotoHomeButton');
    for(var i=0;i<gotoHomeButton.length;i++){
        const button = gotoHomeButton[i]
        button.addEventListener('click',()=>{
            window.location.href = host+ 'tictactoe/'
        })
    }
}

const showgeneratedGameId = () =>{
    let randomIntNumber = Math.floor(Math.random()*maxGameId);
    const target = document.getElementById('link-section');
    let link = 'https://' + window.location.host + '/tictactoe/'+randomIntNumber;
    target.childNodes[1].innerHTML = link; //  target.childNodes[1] p tag in links div

    const multiplayerButton = document.getElementById('multiplayer-button');
    multiplayerButton.addEventListener('click',()=>{
        target.style.display = 'flex';
        const copyButton = target.childNodes[3]; // Button tag in links div
        copyButton.addEventListener('click',()=>copyToClipBoard(link));
    })   
    return randomIntNumber;
}

const copyToClipBoard = (link) => {
    let textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = link
    document.body.appendChild(textInput)
    textInput.select();
    document.execCommand('copy');
    document.body.removeChild(textInput);

    // Change button label
    const copy = document.getElementById('copy');
    copy.innerHTML = 'Copied';

    setTimeout(()=>copy.innerHTML="Waiting for player to join...", 2000);
}