const drawBoard = (matrix) => {
    const board = document.getElementById('board')
    let id = 0
    const allLists = document.getElementsByClassName('box')
    if(allLists.length ===0){
        for(var i=0; i< matrix.length;i++){
            for(var j=0;j < matrix[0].length;j++){
                const li = document.createElement('li')
                li.id = id
                li.className = 'box'
                board.appendChild(li)
                id++
            }
        }
    }
}
const checkForGameOver = (symbol,matrix) =>{
    let found = false;
    found = findHorizontalMatch(symbol,matrix)
    if(!found)
        found = findVerticalMatch(symbol,matrix)
    if(!found)
        found = findDiagonalMatch(symbol,matrix)
    return found
}
const finishGame = (win) => {
    setTimeout(()=>{
        document.getElementById('gameLayout').style.display = 'none';
        player === win ? 
            document.getElementById('finishModal-win').style.display = 'flex'
            : document.getElementById('finishModal-lose').style.display = 'flex'
    },500);
}

const findHorizontalMatch = (symbol,matrix) =>{
    let found = false;
    for(var i=0;i<matrix.length;i++){
        for(var j=0;j<matrix[0].length;j++){
            const li = document.getElementById(i * 3 + j)
            if(li.innerHTML === symbol){
                found = true
            }else{
                found = false
                break
            }
        }
        if(found)
            break
    }
    return found
}

const findVerticalMatch = (symbol,matrix) =>{
    let found = false
    for(var i=0;i< matrix.length;i++){
        for(var j=0;j<matrix[0].length;j++){
            const li = document.getElementById(j * 3 + i)
            if(li.innerHTML === symbol)
                found = true
            else{
                found = false
                break
            }
        }
        if(found)
            break
    }
    return found
}

const findDiagonalMatch = (symbol,matrix) =>{
    let found = false
    i = 0; j = 0
    while(i<matrix.length && j < matrix[0].length){
        const li = document.getElementById(i * 3 + j)
        if(li.innerHTML === symbol){
            found = true
        }else{
            found = false
            break
        }
        i++;j++
    }
    if(!found){
        i = 0; j = matrix.length - 1
        while(i < matrix.length && j >=0){
            const li = document.getElementById(i * 3 + j)
            if(li.innerHTML === symbol)
                found = true
            else{
                found = false
                break
            }
            i++;j--
        }
    }
    return found
}

const flashLi = (id) =>{
    const maxFlash = 3
    let time = 0
    const timeInterval = 40 //ms
    for(var i=0;i < maxFlash;i++){
        setTimeout(()=>document.getElementById(id).style.backgroundColor = '#B74249',time);
        time += timeInterval;
        setTimeout(()=>document.getElementById(id).style.backgroundColor = '#37B2AB',time);
        time += timeInterval
    } 
}
const idToMat = (id) =>{
    const maxNum = 3
    const row = Math.floor(id / maxNum)
    const col = id % 3

    return [row,col]
}

const hideAllModal = ()=>{
    const modalids = ['homeModal', 'finishModal-win', 'finishModal-lose','waitModal']
    modalids.forEach((modal)=>{
        document.getElementById(modal).style.display = 'none'
    })
}

const showToast = (text) =>{
    const toastElem = document.getElementById('toastModal')

    toastElem.children[0].innerHTML = text
    toastElem.style.opacity = 1
    setTimeout(()=>{
        toastElem.style.opacity = 0
    },2000)
}

const isDraw = () => {
    let draw = true
    const allLists = document.getElementsByClassName('box')
    for(var i=0;i<allLists.length;i++){
        const li = allLists[i]
        if(li.innerHTML === ''){
            draw = false
            break
        }
    }
    return draw
}

const showDrawBanner = () => {
    hideAllModal()
    document.getElementById('gameLayout').style.display = 'none';
    document.getElementById('drawModal').style.display = 'flex'
}

const showErrorBanner = (text) =>{
    const errElem = document.createElement('div')
        const button = document.createElement('button')
        button.id = 'gotoHome'
        button.className = 'gotoHomeButton'
        button.innerHTML = "Home"
        errElem.className = 'modal';
        errElem.style.color = '#bbbbbb';
        // errElem.innerHTML = 'Something went wrong 😔';
        errElem.innerHTML = text
        errElem.appendChild(button)
        button.addEventListener('click',()=>{
            window.location.href = host + 'tictactoe/'
        })
        document.body.appendChild(errElem);
}