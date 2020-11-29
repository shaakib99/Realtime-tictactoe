let symbolOfPlayer = null
let symbolOfBot = null
let playerturn = null
let bot = null
const playWithBotEventHandlers = () =>{
    player = 0
    bot = 1
    playerturn = Math.floor(Math.random()*2)
    let symbols = ['X','O']
    const player1SymbolIndex = Math.floor(Math.random()*2)
    const player1Symbol = symbols[player1SymbolIndex]
    const player2Symbol = symbols[player1SymbolIndex === 0 ? 1 : 0]
    symbolOfPlayer = player1Symbol
    symbolOfBot = player2Symbol

    document.getElementById('symbol1').innerHTML = symbolOfPlayer
    document.getElementById('symbol2').innerHTML = symbolOfBot
    let matrix = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]
    
    drawBoard(matrix)
    hideAllModal()
    document.getElementById('gameLayout').style.display = 'flex'
    game(playerturn,player1Symbol,player2Symbol)
}

const game = (playerturn,player1Symbol,player2Symbol)=>{
    playerturn === player ? addClickListener() : removeClickListener()
    playerturn !== player ? randomInput(player2Symbol) : null
}

const addClickListener = () =>{
    showToast('Your Turn')
    const allLists = document.getElementsByClassName('box')
    for(var i=0;i<allLists.length;i++){
        const li = allLists[i]
        li.addEventListener('click',onBoxClick,true)
    }
}

const onBoxClick = (e) =>{
    const id = e.srcElement.id
    const li = document.getElementById(id)
    if(li.innerHTML === ''){
        li.innerHTML = symbolOfPlayer
        playerturn = playerturn === 0 ? 1 : 0
        let matrix = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]
        const isGameOver = checkForGameOver(symbolOfPlayer,matrix)
        const gameDraw = isDraw()
        if( !isGameOver && gameDraw){
            showDrawBanner()
        }else{
            !isGameOver ? game(playerturn,symbolOfPlayer,symbolOfBot) : finishGame(player)
        }
    }
    else
        flashLi(id)
}
const removeClickListener = ()=>{
    const allLists = document.getElementsByClassName('box')
    for(var i=0;i<allLists.length;i++){
        const li = allLists[i]
        li.removeEventListener('click',onBoxClick,true)
    }
}

const randomInput = (symbol) => {
    const allLists = document.getElementsByClassName('box')
    let emptyLId = [] 
    for(var i=0;i<allLists.length;i++){
        const li = allLists[i]
        if (li.innerHTML === '')
            emptyLId.push(li.id)
    }

    randomIndex= Math.floor(Math.random()*emptyLId.length)
    document.getElementById(emptyLId[randomIndex]).innerHTML = symbol
    playerturn = playerturn === 0 ? 1 : 0
    let matrix = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]
    const isGameOver = checkForGameOver(symbolOfBot,matrix)
    const gameDraw = isDraw()
    if( !isGameOver && gameDraw){
        showDrawBanner()
    }else{
        !isGameOver ? game(playerturn,symbolOfPlayer,symbolOfBot) : finishGame(bot)
    }
}