import Eagle from '@/Eagle'
import RectangleGenerator from '@/RectangleGenerator'
import Leaderboard from '@/Leaderboard'

export default class Game {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private gameHasStarted = false
  private gameHasEnded = false
  private eagle: Eagle
  private rectangleGenerator: RectangleGenerator
  private leaderboard: Leaderboard
  private lastTime = 0
  private fps = 60
  private animationId: number
  private score = 0
  private retryButton: HTMLButtonElement
  private gameOverForm: HTMLFormElement

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.retryButton = document.getElementById('retry') as HTMLButtonElement

    this.canvas.width = 480
    this.canvas.height = 640

    this.eagle = new Eagle(this.canvas.width / 2.5, this.canvas.height / 2)
    this.rectangleGenerator = new RectangleGenerator(this.canvas)

    this.gameOverForm = document.getElementById('form') as HTMLFormElement

    this.leaderboard = new Leaderboard(this.gameOverForm)
    this.leaderboard.fetchSubmissions()

    this.gameOverForm.addEventListener('submit', (e: Event) => {
      this.leaderboard.submitForm(e)
      this.restart()
    })

    this.canvas.addEventListener('click', () => this.clicked())

    this.retryButton.addEventListener('click', () => this.restart())

    this.animationId = requestAnimationFrame(() => this.animate())
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = '#70c5ce'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private update(deltaTime: number) {
    // Only apply gravity when the game starts.
    if (this.gameHasStarted) {
      this.eagle.update(deltaTime)
      this.rectangleGenerator.generateRectangles(this.lastTime)
      this.rectangleGenerator.update()
    } else {
      this.eagle.idle(deltaTime)
    }

    const rectangles = this.rectangleGenerator.rectangles

    const passingRectangles = rectangles.filter((rectangle) => {
      return rectangle.isPastEagle(this.eagle.x + this.eagle.width / 2)
    })

    if (passingRectangles.length > 0) {
      this.score += 1
      passingRectangles.forEach((rectangle) => {
        rectangle.isPast = true
      })
    }

    if (this.eagle.isTouchingBottomOfCanvas(this.canvas.height)) {
      this.end()
    }

    rectangles.forEach((rectangle) => {
      if (rectangle.isTouchingEagle(this.eagle)) {
        this.end()
      }
    })
  }

  private draw() {
    if (this.gameHasEnded) {
      this.drawGameOverText()
      return
    }

    this.clear()

    this.eagle.draw(this.ctx, this.gameHasStarted)

    this.rectangleGenerator.draw(this.ctx)

    this.drawScore()

    if (!this.gameHasStarted) {
      this.leaderboard.draw(this.ctx)
    }
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

  public end() {
    this.gameHasEnded = true
    cancelAnimationFrame(this.animationId)

    this.leaderboard.showForm(this.score)
  }

  private clicked() {
    if (this.gameHasEnded) {
      return
    }

    this.gameHasStarted = true
    this.eagle.jump()
  }

  private restart() {
    this.gameHasStarted = false
    this.gameHasEnded = false
    this.leaderboard.hideForm()
    this.leaderboard.fetchSubmissions()
    this.score = 0
    this.rectangleGenerator.clear()
    this.eagle.reset()
    this.lastTime = 0
    this.animationId = requestAnimationFrame(() => this.animate())
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
}
