import Eagle from '@/Eagle'
import RectangleGenerator from '@/RectangleGenerator'
import Rectangle from '@/Rectangle'

export default class Game {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private gameHasStarted = false
  private gameHasEnded = false
  private eagle: Eagle
  private rectangleGenerator: RectangleGenerator
  private lastTime = 0
  private fps = 60
  private animationId: number
  private score = 0

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.canvas.width = 480
    this.canvas.height = 640

    this.eagle = new Eagle(this.canvas.width / 2.5, this.canvas.height / 2)
    this.rectangleGenerator = new RectangleGenerator(this.canvas)

    this.canvas.addEventListener('click', () => {
      if (this.gameHasEnded) {
        this.gameHasStarted = false
        this.eagle.idling = true
        this.restart()
      } else {
        this.gameHasStarted = true
        this.eagle.idling = false
        this.eagle.jump()
      }
    })

    this.animationId = requestAnimationFrame(() => this.animate())
  }

  public end() {
    this.score = 0
    this.gameHasEnded = true
    cancelAnimationFrame(this.animationId)
  }

  private restart() {
    this.rectangleGenerator.clear()
    this.gameHasEnded = false
    this.eagle.reset()
    this.lastTime = 0
    this.animationId = requestAnimationFrame(() => this.animate())
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate())

    const now = performance.now()
    const deltaTime = now - this.lastTime
    const interval = 1000 / this.fps

    if (deltaTime > interval) {
      this.lastTime = now - (deltaTime % interval)
      this.update(deltaTime)
      this.draw()
    }
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = '#70c5ce'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private update(deltaTime: number) {
    if (this.eagle.idling) {
      this.eagle.idle(deltaTime)
    }

    // Only apply gravity when the game starts.
    if (this.gameHasStarted) {
      this.eagle.update(deltaTime)
      this.rectangleGenerator.generateRectangles(this.lastTime)
      this.rectangleGenerator.update()
    }

    const rectangles = this.rectangleGenerator.rects

    // The eagle passed a rectangle, increment the score
    // Check if eagle has passed any rectangles.
    rectangles.forEach((rect) => {
      if (rect.passed) {
        return
      }

      if (this.eagle.x <= rect.x + rect.width) {
        return
      }

      this.score += 0.5

      rect.passed = true
    })

    // The eagle touched the bottom, end the game.
    if (this.eagle.y + this.eagle.radius > this.canvas.height) {
      this.end()
    }

    // The eagle touched a rectangle, end the game.
    const eagleRect = new Rectangle(
      this.eagle.x - this.eagle.width / 1.5,
      this.eagle.y - this.eagle.height / 2,
      this.eagle.height,
    )

    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i]

      // Check if the eagle's bounds intersect with the rectangle
      if (eagleRect.intersects(rect)) {
        this.end()
      }
    }
  }

  private draw() {
    if (this.gameHasEnded) {
      this.drawGameOverText()
      return
    }

    this.clear()
    this.eagle.draw(this.ctx)
    this.rectangleGenerator.draw(this.ctx)
    this.drawScore()
  }

  private drawGameOverText() {
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = 'bold 48px sans-serif'

    const gameOverText = 'Game Over'
    const gameOverTextWidth = this.ctx.measureText(gameOverText).width
    const gameOverTextX = (this.canvas.width - gameOverTextWidth) / 2
    const gameOverTextY = this.canvas.height / 2 - 24

    this.ctx.fillText(gameOverText, gameOverTextX, gameOverTextY)
  }

  private drawScore() {
    const padding = 80
    const textSize = 50
    const text = this.score.toString()

    this.ctx.font = 'bold 54px FlappyBird'
    const textWidth = this.ctx.measureText(text).width

    const x = this.canvas.width / 2 - textWidth / 2
    const y = padding + textSize

    this.ctx.fillStyle = '#fff'
    this.ctx.strokeStyle = '#000'
    this.ctx.lineWidth = 2
    this.ctx.fillText(text, x, y)
    this.ctx.strokeText(text, x, y)
  }
}
