import './style.css'
import Eagle from '@/Eagle'
import RectangleGenerator from '@/RectangleGenerator'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = 480
canvas.height = 640

const eagle = new Eagle(50, 50, 25, canvas.width / 2, canvas.height / 2)
const rectGenerator = new RectangleGenerator(canvas)

canvas.addEventListener('click', () => {
  eagle.velocityY = -4
})

let lastTime = 0
let animationId: number

function animate(timestamp: number) {
  animationId = requestAnimationFrame(animate)

  const elapsed = timestamp - lastTime

  /** Cap the FPS to 60. */
  if (elapsed < 16.67) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#70c5ce'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Generate and draw the rectangles
  rectGenerator.generateRectangles()

  eagle.update()
  eagle.draw(ctx)

  rectGenerator.update()
  rectGenerator.draw(ctx)

  if (!rectGenerator.collidesWithEagle(eagle)) {
    lastTime = timestamp
    return
  }

  cancelAnimationFrame(animationId)
  drawGameOver(ctx)

  document.addEventListener('keydown', pressedSpaceToRestartGame)
  canvas.addEventListener('click', restartGame)
}

function drawGameOver(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 48px sans-serif'

  const gameOverText = 'Game Over'
  const gameOverTextWidth = ctx.measureText(gameOverText).width
  const gameOverTextX = (canvas.width - gameOverTextWidth) / 2
  const gameOverTextY = canvas.height / 2 - 24

  ctx.fillText(gameOverText, gameOverTextX, gameOverTextY)

  ctx.font = 'bold 24px sans-serif'
  ctx.fillStyle = '#FFFFFF'

  const restartText = 'Press space to restart'
  const restartTextWidth = ctx.measureText(restartText).width
  const restartTextX = (canvas.width - restartTextWidth) / 2
  const restartTextY = canvas.height / 2 + 24

  ctx.fillText(restartText, restartTextX, restartTextY)
}

function pressedSpaceToRestartGame(event: KeyboardEvent) {
  if (event.code === 'Space') {
    restartGame()
  }
}

function restartGame() {
  document.removeEventListener('keydown', pressedSpaceToRestartGame)
  canvas.removeEventListener('click', restartGame)
  eagle.reset(canvas)
  animate(performance.now())
}

animationId = requestAnimationFrame(animate)
