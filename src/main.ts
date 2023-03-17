import './style.css'
import Eagle from '@/Eagle'
import RectangleGenerator from '@/RectangleGenerator'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = 480
canvas.height = 640

let gameStarted = false
let lastTime = 0
let animationId: number

const eagle = new Eagle(68, 48, 25, canvas.width / 2.5, canvas.height / 2, [
  '/images/upflap.png',
  '/images/midflap.png',
  '/images/downflap.png',
])

const rectGenerator = new RectangleGenerator(canvas)

canvas.addEventListener('click', () => {
  if (gameStarted) {
    eagle.jump()
  } else {
    startGame()
  }
})

function animate(timestamp: number) {
  // Cap the FPS to 60.
  const elapsed = timestamp - lastTime
  if (elapsed < 1000 / 60) {
    requestAnimationFrame(animate)
    return
  }

  lastTime = timestamp

  animationId = requestAnimationFrame(animate)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#70c5ce'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  rectGenerator.draw(ctx)

  // Draw and update the eagle.
  eagle.draw(ctx)

  if (!gameStarted) {
    return
  }

  // Check for collision with bottom of canvas.
  if (eagle.y + eagle.radius > canvas.height) {
    handleGameOver()
  }

  // Check for collisions between the eagle and the rectangles.
  if (eagle.collidesWithRectangles(rectGenerator.rects)) {
    handleGameOver()
  }

  eagle.update(rectGenerator.rects)

  // Draw the score.
  drawScore()

  // Generate and draw the rectangles.
  rectGenerator.generateRectangles(timestamp)
  rectGenerator.update()
}

function handleGameOver() {
  cancelAnimationFrame(animationId)
  drawGameOver()
  document.addEventListener('keydown', pressedSpaceToRestartGame)
  canvas.addEventListener('click', restartGame)
}

function drawGameOver() {
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

function drawScore() {
  const padding = 80
  const textSize = 50
  const text = eagle.score.toString()

  ctx.font = 'bold 54px FlappyBird'
  const textWidth = ctx.measureText(text).width

  const x = canvas.width / 2 - textWidth / 2
  const y = padding + textSize

  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.fillText(text, x, y)
  ctx.strokeText(text, x, y)
}

function pressedSpaceToRestartGame(event: KeyboardEvent) {
  if (event.code === 'Space') {
    restartGame()
  }
}

function startGame() {
  gameStarted = true
}

function restartGame() {
  // Clear the rectangles from the canvas.
  rectGenerator.rects = []

  // Reset the eagle's position and velocity.
  eagle.reset(canvas)

  // Remove the event listeners for restarting the game.
  document.removeEventListener('keydown', pressedSpaceToRestartGame)
  canvas.removeEventListener('click', restartGame)

  // Start the animation loop.
  gameStarted = false
  lastTime = 0
  animate(0)
  eagle.score = 0
}

animationId = requestAnimationFrame(animate)
