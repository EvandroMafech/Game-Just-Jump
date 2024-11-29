const jumpAudio = new Audio("sounds/Jump.wav")

class Player{
    constructor(image,ctx,cordinates,spritewidth,spriteHeight,spriteOffset){
        this.position = {
            x: 200,
            y: -200
        }
        this.MoveAction = {
            left: false,
            right: false,
            jump: false
        }
        this.playerState = {
            isOnPlatform: false,
            isJumping: false,
            keyJumpIsUp: true
        }
        this.spriteOffset = {
            bottom: spriteOffset.bottom || 0,
            left: spriteOffset.left || 0,
            right: spriteOffset.right || 0
        }
        this.ctx = ctx
        this.spriteImage = image
        this.gravity = 1
        this.velocityY = 0
        this.speed = 8
        this.jumpStrength = -25
        this.gameFrame = 1
        this.staggerFrames = 3
        this.spriteWidth = spritewidth
        this.spriteHeight = spriteHeight
        this.spriteState = "idle"
        this.cordinates = cordinates
        this.spriteSize = 0.5
    }


jump(){
    
    if(!this.playerState.isJumping && !this.playerState.isOnPlatform && this.playerState.keyJumpIsUp){
      jumpAudio.play()
      this.velocityY = this.jumpStrength
      this.position.y += this.velocityY
      this.playerState.isJumping = true
      this.playerState.keyJumpIsUp = false
      this.spriteState = "jump"    
    }
}


animate(){
    const ctx = this.ctx
    const cordinates = this.cordinates
    let position = Math.floor(this.gameFrame/this.staggerFrames)%cordinates[this.spriteState].location.length

    let frameX = position*this.spriteWidth
    let frameY = cordinates[this.spriteState].location[position].y

    ctx.drawImage(this.spriteImage,frameX,frameY, this.spriteWidth,this.spriteHeight, this.position.x, this.position.y , this.spriteWidth*this.spriteSize,this.spriteHeight*this.spriteSize) //(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

move()
{
    if(this.MoveAction.left){
         this.position.x -= this.speed
    }else{
         this.position.x += this.speed
    }
}

checkPlatform(platform){
        const playerBottomY = this.position.y + this.spriteHeight*this.spriteSize - this.spriteOffset.bottom*this.spriteSize
        const playerOffSetBottom = this.spriteHeight*this.spriteSize - this.spriteOffset.bottom*this.spriteSize
        const playerLeftX = this.position.x + this.spriteOffset.left*this.spriteSize
        const playerRightX = this.position.x + this.spriteWidth*this.spriteSize - this.spriteOffset.right*this.spriteSize
        

        const topPlatform = platform.position.y
        const leftPlatform = platform.position.x
        const rightPlatform = platform.position.x + platform.width

    if(playerBottomY >= topPlatform &&
        playerBottomY <= topPlatform + platform.height &&
        playerRightX >= leftPlatform &&
        playerLeftX <= rightPlatform &&
        this.velocityY > 0 
      )
    {
        this.playerState.isOnPlatform = true
        this.velocityY = 0
        this.position.y = platform.position.y - playerOffSetBottom + platform.speed
        this.playerState.isJumping = false
        this.spriteState = "idle"
    }
    this.playerState.isOnPlatform = false


}


applyGravity(){

    if(this.playerState.isOnPlatform == false){
        this.velocityY += this.gravity
        this.position.y += this.velocityY
    }
}


}


export default Player