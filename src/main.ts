import './style.css'
import Eagle from '@/Eagle'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = 480
canvas.height = 640

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
        const shouldContinue = eagle.update(canvas)

        if (!shouldContinue) {
            cancelAnimationFrame(animationId)

            const gameOverMenu = document.createElement('div')
            gameOverMenu.innerText = 'Game Over'

            const restartButton = document.createElement('button')
            restartButton.innerText = 'Restart'

            restartButton.addEventListener('click', () => {
                gameOverMenu.remove()

                eagle.y = canvas.height / 2
                eagle.velocityY = 0

                animationId = requestAnimationFrame(animate)
            })

            gameOverMenu.appendChild(restartButton)
            document.body.appendChild(gameOverMenu)
        }

        lastTime = timestamp
    }
}

animationId = requestAnimationFrame(animate)