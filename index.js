const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
const gravity = 0.2;
const playerHP = document.querySelector("#playerHP");
const enemyHP = document.querySelector("#EnemyHP");
let result = document.getElementById("result")
result.innerHTML = "";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0,0,canvas.width,canvas.height);

const background = new Sprite({position: {x: 0,y: 0},imageSrc: "./assets/background.png",scale:1,width:canvas.width,height:canvas.height});
const shop = new Sprite({position: {x: (canvas.width - 400),y: (canvas.height-450)},imageSrc: "./assets/shop.png",scale:2.7,framesMax:6})
// create Player
const player = new Fighter({position:{x: 100,y: 0},velocity:{x: 0,y: 0},imageSrc: "./assets/samuraiMack/Idle.png",framesMax:8,scale:3.8,offset:{x:0,y:95},sprites:{Idle:{imageSrc:"./assets/samuraiMack/Idle.png",framesMax:8},Run:{imageSrc:"./assets/samuraiMack/Run.png",framesMax:8},Jump:{imageSrc:"./assets/samuraiMack/Jump.png",framesMax:2},Fall:{imageSrc:"./assets/samuraiMack/Fall.png",framesMax:2},Attack1:{imageSrc:"./assets/samuraiMack/Attack1.png",framesMax:6},TakeHit:{imageSrc:"./assets/samuraiMack/Take Hit.png",framesMax:4},Death:{imageSrc:"./assets/samuraiMack/Death.png",framesMax:6}},AttackBox:{offset:{x:100,y:400},width:150,height:50}});
// create Enemy
const enemy = new Fighter({position:{x: (canvas.width - 100),y: 0},velocity:{x:0,y:0},imageSrc: "./assets/Kenji/Idle.png",framesMax:4,scale:3.4,offset:{x:0,y:70},sprites:{Idle:{imageSrc:"./assets/Kenji/Idle.png",framesMax:4},Run:{imageSrc:"./assets/Kenji/Run.png",framesMax:8},Jump:{imageSrc:"./assets/Kenji/Jump.png",framesMax:2},Fall:{imageSrc:"./assets/kenji/Fall.png",framesMax:2},Attack1:{imageSrc:"./assets/Kenji/Attack1.png",framesMax:4},TakeHit:{imageSrc:"./assets/Kenji/Take hit.png",framesMax:3},Death:{imageSrc:"./assets/Kenji/Death.png",framesMax:7}},AttackBox:{offset:{x:0,y:400},width:150,height:50}});

function animate(){
    window.requestAnimationFrame(animate);

    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255,255,255,0.1)";
    c.fillRect(0,0,canvas.width,canvas.height)

    player.update();
    enemy.update();

    // c.strokeStyle = 'red';
    // c.beginPath();
    // c.moveTo(0, canvas.height - groundHeight + player.offset.y);
    // c.lineTo(canvas.width, canvas.height - groundHeight + player.offset.y);
    // c.stroke();

    // player Movement
    player.velocity.x = 0;
    if(keys.a.pressed && player.lastKey === "a"){
        player.switchSprites("Run");
        player.velocity.x = -5;
    }else if(keys.d.pressed && player.lastKey === "d"){
        player.switchSprites("Run");
        player.velocity.x = 5;
    } else {
    player.switchSprites("Idle");
    }


    playerHP.style.width = `${(player.health/120)*100}%`
    enemyHP.style.width = `${(enemy.health/120)*100}%`

    // Enemy Movement
    enemy.velocity.x = 0;
    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft"){
        enemy.switchSprites("Run");
        enemy.velocity.x = -5;
    }else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight"){
        enemy.switchSprites("Run");
        enemy.velocity.x = 5;
    } else {
        enemy.switchSprites("Idle");
    }

    // player Attack hit
    if(detectCollision({collider1: player, collider2: enemy}) && player.isAttacking && player.framesCurrent === 4){
        enemy.takeHit();
        player.isAttacking = false;
    }
    // enemy Attack hit
    if(detectCollision({collider1: enemy, collider2: player}) && enemy.isAttacking&& enemy.framesCurrent === 2){
        player.takeHit();
        enemy.isAttacking = false;
    }

    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // Result
    if(player.health <= 0){
        result.innerHTML = "You Lose"
        endScreen.style.opacity = 1;
        endScreen.style.pointerEvents = "all";
        clearInterval(timer)
    }else if(enemy.health <= 0){
        result.innerHTML = "You Win"
        endScreen.style.opacity = 1;
        endScreen.style.pointerEvents = "all";
        clearInterval(timer)
    }

    if (player.velocity.y < 0 && player.onGround) {
        player.switchSprites("Jump");
    } else if(player.velocity.y > 0){
        player.switchSprites("Fall");
    }
    if (enemy.velocity.y < 0 && enemy.onGround) {
        enemy.switchSprites("Jump");
    } else if(enemy.velocity.y > 0){
        enemy.switchSprites("Fall");
    }
}

function init() {
    document.getElementById("menuScreen").style.display = "none";
    document.querySelector(".header").style.display = "flex";
    Time();
    animate();
}

window.addEventListener("keydown",(e)=>{
if (player.isAlive) {
    switch(e.key){
        case "d":
            keys.d.pressed = true;
            player.lastKey = "d"
            break;
        case "a":
            keys.a.pressed = true;
            player.lastKey = "a"
            break;
        case "w":
            if (player.onGround) {
                console.log(player.onGround)
                console.log(player.position.y);
                console.log(player.position.y + player.height);
                console.log(canvas.height + player.offset.y);
                
                player.velocity.y = -10;
            }
            break;
        case " ":
            player.Attack();
            break;
    }
}
if (enemy.isAlive) {
    switch(e.key){
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight"
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft"
            break;
        case "ArrowUp":
            if (enemy.onGround) {
                enemy.velocity.y = -10;
            }
            break;
        case "ArrowDown":
            enemy.Attack();
            break;
        };
}
})
window.addEventListener("keyup",(e)=>{
    switch(e.key){
        case "d":
            keys.d.pressed = false;
            player.lastKey = "d";
            break;
        case "a":
            keys.a.pressed = false;
            player.lastKey = "a";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            enemy.lastKey = "ArrowRight";
            break;
        }
})

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    background.width = canvas.width;
});