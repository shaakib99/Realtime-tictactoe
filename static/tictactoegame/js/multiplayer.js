let valueHolder = new Array(9)
const handleMultiplayerEvent = (gameId,player) => {
    const initiate = 'initiate';
    const initiated = 'initiated';
    const close = 'close';

    player == 1 ? showWaitBanner() : null;

    let link = 'ws://'+window.location.host+'/ws/game/'+gameId+'/';
    let gameSocket = new WebSocket(link);
    
    gameSocket.onopen = (e) =>{}
    const sendData = (data) => {
        gameSocket.send(data)
    }
    gameSocket.onmessage = (e)=>{
        let data = JSON.parse(e.data)
        let playerSymbol = data.symbols !== undefined ? data.symbols[player] : null
        let playerturn = data.playerturn !== undefined ? data.playerturn : null
        if(data.status === initiate){
            hideAllModal()
            drawBoard(data.matrix)
            document.getElementById('homeModal').style.display = 'none';
            document.getElementById('waitModal').style.display = 'none';
            document.getElementById('gameLayout').style.display = 'flex';
        }
        else if(data.status === initiated){
            const id = data.changedCoord[0] * 3 + data.changedCoord[1]
            document.getElementById(id).innerHTML = data.symbols[data.changedBy]
        }
        else if(data.status === close){
            if(data.win !== null){
                const id = data.changedCoord[0] * 3 + data.changedCoord[1]
                document.getElementById(id).innerHTML = data.symbols[data.changedBy]
                finishGame(data.win)
            }else{
                document.getElementById('left-msg').style.display = 'none'
                document.getElementById('finishModal-win').style.display = 'none'
                document.getElementById('gameLayout').style.display = 'none';
                document.getElementById('left-msg').style.display = 'flex'
                document.getElementById('finishModal-win').style.display = 'flex'
            }
        }
        playerturn === player ? addClickListenertoList(data,sendData,playerSymbol) 
        : removeClickListenertoList(data,sendData,playerSymbol)
    }

    gameSocket.onerror = (e) =>{
        document.getElementById('homeModal').style.display = 'none';
        document.getElementById('waitModal').style.display = 'none';

        const errElem = document.createElement('div')
        errElem.className = 'modal';
        errElem.style.color = '#bbbbbb';
        errElem.innerHTML = 'Something went wrong 😔';
        document.body.appendChild(errElem);
    }

}

const addClickListenertoList = (data,send,symbol) => {
    showToast('Your Turn')
    const allLists = document.getElementsByClassName('box');
    for(var i=0;i<allLists.length;i++){
        const li = allLists[i]
        let tempInfo = {
            id:li.id,
            send: send,
            data:data,
            symbol: symbol
        }
        valueHolder[i] = tempInfo
        li.addEventListener('click',sendClickedData,false)
    }
}

const sendClickedData = (e)=>{
    const index = e.srcElement.id
    const info = valueHolder[index]
    let id = info.id
    let data = info.data
    const li = document.getElementById(id)
    if(li.innerHTML === ''){
        li.innerHTML = info.symbol
        let isGameOver = checkForGameOver(info.symbol,data.matrix)
        data.changedCoord = idToMat(id)
        data.changedBy = player
        data.status = isGameOver ? 'close' : 'initiated'
        data.win = isGameOver ? player : null
        data.status === 'close' ? finishGame(data.win) : null
        info.send(JSON.stringify(data))
    }
    else{
        flashLi(id)
    }
}

const removeClickListenertoList = () =>{
    const allLists = document.getElementsByClassName('box');
    for(var i=0;i<allLists.length;i++){
        const li = allLists[i]
        li.removeEventListener('click',sendClickedData,false)
    }
}

const showWaitBanner = ()=>{
    document.getElementById('homeModal').style.display = 'none';
    document.getElementById('waitModal').style.display = 'flex';
}