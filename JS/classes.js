class Sprite{
    constructor({position,imageSrc,scale=2,width,height,framesMax=1,offset={x:0,y:0}}){
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.width = (width/framesMax) * scale || (this.image.width/framesMax) * scale;
        this.height = height * scale || this.image.height * scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;


        this.image.onload = () => {
        this.width = this.width || (this.image.width/framesMax) * scale;
        this.height = this.height || this.image.height * scale;
        };
    };
    draw(){
        c.drawImage(this.image, this.framesCurrent*(this.image.width/this.framesMax) , 0 , (this.image.width/this.framesMax),this.image.height,this.position.x,this.position.y + this.offset.y,this.width,this.height)
    }
    animateFrames(){
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {   
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            }else{
                this.framesCurrent=0;
            }
        }
    }
    update(){
        this.draw();
        this.animateFrames();
    }
};

class Fighter extends Sprite{
    constructor({position,velocity,imageSrc,scale=2,framesMax=1,offset={x:0,y:0},sprites,AttackBox={offset:{},width:undefined,height:undefined}}){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity;
        this.health = 120;
        this.lastKey;
        this.AttackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: AttackBox.offset,
            width: AttackBox.width,
            height: AttackBox.height
        };
        this.isAttacking;
        this.isAlive = true;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.sprites = sprites;
        this.onGround;

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    };
        
    Attack(){
        this.switchSprites("Attack1");
        this.isAttacking = true;
        setTimeout(()=>{
            this.isAttacking = false;
        },1000);
    }
    takeHit(){        
        this.health -= 10;
        if (this.health <= 0) {
            this.switchSprites("Death");
        }else this.switchSprites("Take hit");
    }
    switchSprites(sprite){

        if (this.image == this.sprites.Death.image) {
            if (this.framesCurrent == this.sprites.Death.framesMax - 1) {
                this.isAlive = false;
            }
            return;
        };

        // override all other animations and show Attack
        if (this.image == this.sprites.Attack1.image && this.framesCurrent < this.sprites.Attack1.framesMax - 1) return;

        // override all other animations and show TakeHit
        if (this.image == this.sprites.TakeHit.image && this.framesCurrent < this.sprites.TakeHit.framesMax - 1) return;

        switch(sprite){
            case "Idle":
                if(this.image != this.sprites.Idle.image){
                    this.image = this.sprites.Idle.image;
                    this.framesMax = this.sprites.Idle.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case "Run":
                if(this.image != this.sprites.Run.image){
                    this.image = this.sprites.Run.image;
                    this.framesMax = this.sprites.Run.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case "Jump":
                if(this.image != this.sprites.Jump.image){
                    this.image = this.sprites.Jump.image;
                    this.framesMax = this.sprites.Jump.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case "Fall":
                if(this.image != this.sprites.Fall.image){
                    this.image = this.sprites.Fall.image;
                    this.framesMax = this.sprites.Fall.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case "Attack1":
                if(this.image != this.sprites.Attack1.image){
                    this.image = this.sprites.Attack1.image;
                    this.framesMax = this.sprites.Attack1.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case "Take hit":
                if(this.image != this.sprites.TakeHit.image){
                    this.image = this.sprites.TakeHit.image;
                    this.framesMax = this.sprites.TakeHit.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case "Death":
                if(this.image != this.sprites.Death.image){
                    this.image = this.sprites.Death.image;
                    this.framesMax = this.sprites.Death.framesMax;
                    this.framesCurrent = 0;
                }
            break;
        }

    }
    stayWithinCanvas(canvasWidth) {
        const minX = -this.offset.x + 10;
        const maxX = canvasWidth - this.width + this.offset.x - 10;

        if (this.position.x < minX) this.position.x = minX;
        if (this.position.x > maxX) this.position.x = maxX;
    }
    update(){
        this.draw();
        if (this.isAlive) {
            this.animateFrames();
        }
        this.AttackBox.position.x = this.position.x + this.AttackBox.offset.x;
        this.AttackBox.position.y = this.position.y + this.AttackBox.offset.y;
        c.fillRect(this.AttackBox.position.x,this.AttackBox.position.y,this.AttackBox.width,this.AttackBox.height);

        this.onGround = this.position.y + this.height>= canvas.height + this.offset.y && this.velocity.y >= 0;

        if (this.onGround) {
            this.velocity.y = 0;
        } else if(!this.onGround){
            this.velocity.y += gravity;
        }
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        
        
    }
};
