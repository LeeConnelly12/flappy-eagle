import './style.css'
import Eagle from '@/Eagle'
import RectangleGenerator from '@/RectangleGenerator'
import Game from '@/Game'

let lastTime = 0
let animationId: number

const game = new Game()

const eagle = new Eagle(game.canvas, game.ctx)

const rectGenerator = new RectangleGenerator(game.canvas, game.ctx)

game.canvas.addEventListener('click', () => {
  game.started = true
  eagle.jump(game.started)
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

  // Clear the canvas.
  game.clear()

  // Draw and update the eagle.
  eagle.update(game.started, rectGenerator.rects)
  eagle.draw()

  if (!game.started) {
    return
  }

  // Generate and draw the rectangles.
  rectGenerator.generateRectangles(timestamp)
  rectGenerator.update()
  rectGenerator.draw()

  // Check for collision with bottom of canvas.
  if (eagle.y + eagle.radius > game.canvas.height) {
    cancelAnimationFrame(animationId)
    game.end()
    game.canvas.addEventListener('click', restartGame)
  }

  // Check for collisions between the eagle and the rectangles.
  if (eagle.collidesWithRectangles(rectGenerator.rects)) {
    cancelAnimationFrame(animationId)
    game.end()
    game.canvas.addEventListener('click', restartGame)
  }

  // Draw the score.
  drawScore()
}

function drawScore() {
  const padding = 80
  const textSize = 50
  const text = eagle.score.toString()

  game.ctx.font = 'bold 54px FlappyBird'
  const textWidth = game.ctx.measureText(text).width

  const x = game.canvas.width / 2 - textWidth / 2
  const y = padding + textSize

  game.ctx.fillStyle = '#fff'
  game.ctx.strokeStyle = '#000'
  game.ctx.lineWidth = 2
  game.ctx.fillText(text, x, y)
  game.ctx.strokeText(text, x, y)
}

function restartGame() {
  // Clear the rectangles from the canvas.
  rectGenerator.rects = []

  // Reset the eagle's position and velocity.
  eagle.reset(canvas)

  // Remove the event listener for restarting the game.
  game.canvas.removeEventListener('click', restartGame)

  // Start the animation loop.
  game.started = false
  lastTime = 0
  animate(0)
  eagle.score = 0
}

animationId = requestAnimationFrame(animate)
