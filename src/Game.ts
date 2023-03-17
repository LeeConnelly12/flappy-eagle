export default class Game {
  public readonly canvas: HTMLCanvasElement
  public readonly ctx: CanvasRenderingContext2D
  public started = false

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.canvas.width = 480
    this.canvas.height = 640

    this.canvas.addEventListener('click', () => {
      this.started = true
    })
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = '#70c5ce'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  public end() {
    this.drawGameOverText()
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
}
