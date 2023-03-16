export default class Eagle {
  public velocityY = 0
  private gravity = 0.2

  constructor(
    public width: number,
    public height: number,
    public radius: number,
    public x: number,
    public y: number,
  ) {}

  public draw(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.stroke()
  }

  public update() {
    this.y += this.velocityY
    this.velocityY += this.gravity
  }

  public reset(canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.velocityY = 0
  }
}
