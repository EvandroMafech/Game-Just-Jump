import Platform from "./Platform.js"
import Player from "./Player.js"

const leftCanvas = document.querySelector(".left-canvas")
const startGameScreen = document.querySelector(".start-game")
const rightCanvas = document.querySelector(".right-canvas")
const leftScreen = document.querySelector(".left-screen")
const rightScreen = document.querySelector(".right-screen")
const leftCtx = leftCanvas.getContext("2d")
const rightCtx = rightCanvas.getContext("2d")

const boySpriteSheet = new Image()
const girlSpriteSheet = new Image()
const platformImage = new Image()

const fallingAudio = new Audio("sounds/falling.wav")


let frameCount = 80
let framesToGeneratePlatform = 130
let speed = 3
let speedCount = 0
let gameStarted = false


boySpriteSheet.src = "images/boySprites.png"
girlSpriteSheet.src = "images/girlSprites.png"
platformImage.src = "images/platform.png"

const leftPlatformArray = []
const rightPlatformArray = []
const boySpriteCoordinates = []
const girlSpriteCoordinates = []

const platformWidth = 220
const platformHeight = 20

const boyStripeWidth = 614
const boyStripeHeigth = 564

const girlStripeWidth = 416
const girlStripeHeigth = 454

const boySpriteOffset = {
    bottom: 63,
    left: 100,
    right: 440
}
const girlSpriteOffset = {
    bottom: 0,
    left: 210,
    right: 150
}

const boyStripesInfo = [

    {
        name: "idle",
        frames: 15
    },
    {
        name: "jump",
        frames: 15
    }
]

const girlStripesInfo = [

    {
        name: "idle",
        frames: 15
    },
    {
        name: "jump",
        frames: 30
    }
]

boyStripesInfo.forEach((content,index) => {
    let frames = {
        location: []
    }
    for(let i = 0; i < boyStripesInfo[index].frames; i++)
    {
        let positionX = i*boyStripeWidth
        let positionY = index*boyStripeHeigth
        frames.location.push({x: positionX, y: positionY})
    }
    boySpriteCoordinates[content.name] = frames
})

girlStripesInfo.forEach((content,index) => {
    let frames = {
        location: []
    }
    for(let i = 0; i < girlStripesInfo[index].frames; i++)
    {
        let positionX = i*girlStripeWidth
        let positionY = index*girlStripeHeigth
        frames.location.push({x: positionX, y: positionY})
    }
    girlSpriteCoordinates[content.name] = frames
})


const boyPlayer = new Player(boySpriteSheet,leftCtx,boySpriteCoordinates,boyStripeWidth,boyStripeHeigth,boySpriteOffset) 
const girlPlayer = new Player(girlSpriteSheet,rightCtx,girlSpriteCoordinates,girlStripeWidth,girlStripeHeigth,girlSpriteOffset) 

const leftPlatform = new Platform(150,200,platformWidth,platformHeight,leftCtx,platformImage,speed)
const rightPlatform = new Platform(150,200,platformWidth,platformHeight,rightCtx,platformImage,speed)

let lastLeftPlatformXpos = leftPlatform.position.x
let lastRightPlatformXpos = rightPlatform.position.x

function generatePlatform(){

    let leftRandonX = Math.random()*(leftCanvas.width-leftPlatform.width)
    let rightRandonX = Math.random()*(rightCanvas.width-rightPlatform.width) 
    
    if(frameCount >= framesToGeneratePlatform){
    frameCount = 0
  
    while(Math.abs(leftRandonX - lastLeftPlatformXpos) > 450){
        leftRandonX = Math.random()*(leftCanvas.width-leftPlatform.width)
    }
    while(Math.abs(rightRandonX - lastRightPlatformXpos) > 450){
        rightRandonX = Math.random()*(rightCanvas.width-rightPlatform.width)
    }

    lastLeftPlatformXpos = leftRandonX
    lastRightPlatformXpos = rightRandonX
  
    const Lplatform = new Platform(leftRandonX ,0,platformWidth,platformHeight,leftCtx,platformImage,speed)
    const Rplatform = new Platform(rightRandonX,0,platformWidth,platformHeight,rightCtx,platformImage,speed)
 
    leftPlatformArray.push(Lplatform)
    rightPlatformArray.push(Rplatform)

    if(leftPlatformArray.length > 10) leftPlatformArray.shift()
    if(rightPlatformArray.length > 10) rightPlatformArray.shift()
    }
}

function checkGameOver(){
    if(boyPlayer.position.y > 1000 || girlPlayer.position.y > 1000)
    {
      
        if(boyPlayer.position.y > 1000) leftScreen.classList.add("grayFilter")
        if(girlPlayer.position.y > 1000) rightScreen.classList.add("grayFilter")    
        fallingAudio.play()    
        setTimeout(() => {
            location.reload()
        },2000)
    }
}

function changeSpeed(){
    if(speedCount > 1000){
        speed++
        if(speed == 4)framesToGeneratePlatform = 100
        if(speed == 5)framesToGeneratePlatform = 85
        if(speed == 6)framesToGeneratePlatform = 75
        if(speed == 7)framesToGeneratePlatform = 70
        if(speed == 8)framesToGeneratePlatform = 65
        if(speed == 9)framesToGeneratePlatform = 60
        if(speed == 10)framesToGeneratePlatform = 55
        if(speed == 12)framesToGeneratePlatform = 50

        speedCount = 0
       // console.log(`speed = ${speed} Platform = ${framesToGeneratePlatform}`)    
       }
}


function resizeCanvas(){
 
    leftCanvas.height = leftCanvas.parentElement.offsetHeight
    leftCanvas.width = leftCanvas.parentElement.offsetWidth
    
    rightCanvas.height = rightCanvas.parentElement.offsetHeight
    rightCanvas.width = rightCanvas.parentElement.offsetWidth
}


function gameLoop(){
  
    leftCtx.clearRect(0,0,leftCanvas.width,leftCanvas.height)
    rightCtx.clearRect(0,0,leftCanvas.width,leftCanvas.height)

   //checkGameOver()

    leftPlatformArray.forEach( platform => {
        platform.draw()
        platform.update()
        boyPlayer.checkPlatform(platform)
    })
  
    rightPlatformArray.forEach( platform => {
        platform.draw()
        platform.update()
        girlPlayer.checkPlatform(platform)
    })

    leftPlatform.draw()
    rightPlatform.draw()

    leftPlatform.update()
    rightPlatform.update()

    boyPlayer.applyGravity()
    girlPlayer.applyGravity()
   
    boyPlayer.checkPlatform(leftPlatform)
    girlPlayer.checkPlatform(rightPlatform)
 

    boyPlayer.animate()
    girlPlayer.animate()

    boyPlayer.gameFrame++
    girlPlayer.gameFrame++

    if(boyPlayer.MoveAction.jump) boyPlayer.jump()     
    if(girlPlayer.MoveAction.jump) girlPlayer.jump()     
    if(girlPlayer.MoveAction.left || girlPlayer.MoveAction.right) girlPlayer.move()
    if(boyPlayer.MoveAction.left || boyPlayer.MoveAction.right) boyPlayer.move()

 
    generatePlatform() 
    changeSpeed()
  
    frameCount++
    speedCount++
  
    window.requestAnimationFrame(gameLoop)
}

resizeCanvas()


window.addEventListener("resize", resizeCanvas)

window.addEventListener("keydown",(event) => {
    const key = event.key.toLowerCase() 

    if(key == "arrowup"){ 
        girlPlayer.MoveAction.jump = true
    } 
    if(key == "arrowleft"){ girlPlayer.MoveAction.left = true}
    if(key == "arrowright"){girlPlayer.MoveAction.right = true}

    if(key == "a"){boyPlayer.MoveAction.left = true}
    if(key == "d"){boyPlayer.MoveAction.right = true}
    if(key == "w"){
        boyPlayer.MoveAction.jump = true
    }
    if(key == "enter" && gameStarted == false) {
        startGameScreen.style.display = "none"
        gameStarted = true
        gameLoop()
    }
})

window.addEventListener("keyup",(event) => {
    const key = event.key.toLowerCase() 

    if(key == "arrowup"){ 
        girlPlayer.MoveAction.jump = false
        girlPlayer.playerState.keyJumpIsUp = true
    } 
    if(key == "arrowleft"){ girlPlayer.MoveAction.left = false}
    if(key == "arrowright"){girlPlayer.MoveAction.right = false}

    if(key == "a"){boyPlayer.MoveAction.left = false}
    if(key == "d"){boyPlayer.MoveAction.right = false}
    if(key == "w"){
        boyPlayer.MoveAction.jump = false
        boyPlayer.playerState.keyJumpIsUp = true
    }
})
