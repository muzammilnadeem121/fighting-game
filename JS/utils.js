let timeLeft = 120;
let endScreen  = document.querySelector(".endScreen");

function Time() {
    const timer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    let label = document.getElementById("timer")

    label.innerHTML = `0${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(timer);
        label.innerHTML = "GAME OVER";
        
        if (player.health == enemy.health) {
            result.innerHTML = "TIE"
        }else if(player.health < enemy.health){
            result.innerHTML = "You Lose"
        }else{
            result.innerHTML = "You Win"
        }
        endScreen.style.opacity = 1;
        endScreen.style.pointerEvents = "all";
    }
}, 1000);   
}

function detectCollision({ collider1, collider2 }) {
    return (
        collider1.AttackBox.position.x + collider1.AttackBox.width >= collider2.position.x &&
        collider1.AttackBox.position.x <= collider2.position.x + collider2.width &&
        collider1.AttackBox.position.y + collider1.AttackBox.height >= collider2.position.y &&
        collider1.AttackBox.position.y <= collider2.position.y + collider2.height
    );
}

// define Keys
const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
};
function retryGame(){
    init();
}
