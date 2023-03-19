import axios from 'axios'

export default class Leaderboard {
  private form: HTMLFormElement
  private submissions: { name: string; score: number }[] = []

  constructor() {
    this.form = document.getElementById('form') as HTMLFormElement
    this.form.addEventListener('submit', (e: Event) => this.submitForm(e))
  }

  public showForm(score: number) {
    this.form.classList.remove('hidden')
    const scoreInput = this.form.querySelector('#score') as HTMLInputElement
    scoreInput.value = score.toString()
  }

  public hideForm() {
    this.form.classList.add('hidden')
  }

  public async fetchSubmissions() {
    const { data } = await axios.get('/leaderboard')
    this.submissions = data.data
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.submissions.length; i++) {
      const submission = this.submissions[i]
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(
        `#${i + 1} ${submission.name} - ${submission.score}`,
        300,
        (i + 12) * 30,
      )
    }
  }

  public submitForm(e: Event) {
    e.preventDefault()
    const data = new FormData(this.form)
    axios.post('/leaderboard', data)
  }
}
