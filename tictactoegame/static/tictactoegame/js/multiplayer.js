let valueHolder = new Array(9)
const handleMultiplayerEvent = (gameId,player) => {
    const initiate = 'initiate';
    const initiated = 'initiated';
    const close = 'close';

    player == 1 ? showWaitBanner() : null;

    let link = 'wss://'+window.location.host+'/ws/game/'+gameId+'/';
    let gameSocket = new WebSocket(link);
    
    gameSocket.onopen = (e) =>{}
    let gameStarted = false
    setTimeout(()=>{
        if(!gameStarted){
            hideAllModal()
            showErrorBanner('No response from other player')
            gameSocket.close()
        }
    },15*1000)
    const sendData = (data) => {
        gameSocket.send(data)
    }
    gameSocket.onmessage = (e)=>{
        let data = JSON.parse(e.data)
        gameStarted = true
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
            gameSocket.close()
        }
        else if(data.status === 'draw'){
            showDrawBanner()
            gameSocket.close()
        }
        playerturn === player ? addClickListenertoList(data,sendData,playerSymbol) 
        : removeClickListenertoList(data,sendData,playerSymbol)
    }

    gameSocket.onerror = (e) =>{
        document.getElementById('homeModal').style.display = 'none';
        document.getElementById('waitModal').style.display = 'none';

        showErrorBanner('Something went wrong 😔')
        gameSocket.close()
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
        console.log(isGameOver)
        data.status = isGameOver ? 'close' : 'initiated'
        data.win = isGameOver ? player : null
        data.status === 'close' ? finishGame(data.win) : null
        
        const gameDraw = data.win === null && isDraw()
        data.status = gameDraw ? 'draw' : data.status

        gameDraw ? showDrawBanner() : null
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