import './style.css'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = 480
canvas.height = 640

class Eagle {
    public velocityY = 0
    private gravity = 0.2

    constructor(
        public width: number,
        public height: number,
        public radius: number,
        public x: number,
        public y: number
    ) { }

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.stroke()
    }

    update() {
        this.velocityY += this.gravity

        this.y += this.velocityY

        if (this.y + this.radius >= canvas.height) {
            cancelAnimationFrame(animationId)

            const gameOverMenu = document.createElement('div')
            gameOverMenu.innerText = 'Game Over'

            const restartButton = document.createElement('button')
            restartButton.innerText = 'Restart'

            restartButton.addEventListener('click', () => {
                gameOverMenu.remove()

                this.y = canvas.height / 2
                this.velocityY = 0

                animationId = requestAnimationFrame(animate)
            })

            gameOverMenu.appendChild(restartButton)
            document.body.appendChild(gameOverMenu)
        }
    }
}

const eagle = new Eagle(50, 50, 25, canvas.width / 2, canvas.height / 2)

canvas.addEventListener('click', () => {
    eagle.velocityY = -4
})

let lastTime = 0
let animationId: number

function animate(timestamp: number) {
    animationId = requestAnimationFrame(animate)

    const elapsed = timestamp - lastTime

    if (elapsed >= 16.67) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#70c5ce'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        eagle.draw(ctx)
        eagle.update()

        lastTime = timestamp
    }
}

animationId = requestAnimationFrame(animate)
