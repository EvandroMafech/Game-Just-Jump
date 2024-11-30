class Platform{
            constructor(x,y,width,height,ctx,image,speed){
                this.position = {
                    x: x,
                    y: y
                }
                this.width = width
                this.height = height
                this.ctx = ctx
                this.speed = speed
                this.image = image
            }
           
            draw(){
                const ctx = this.ctx
                const image = this.image
                ctx.drawImage(image,this.position.x,this.position.y,this.width,70) //(image, dx, dy, dWidth, dHeight);
                //ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
            }

            update(){
                this.position.y += this.speed
            }
            
}

export default Platform