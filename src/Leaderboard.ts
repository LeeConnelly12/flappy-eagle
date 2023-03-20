import axios from 'axios'

export default class Leaderboard {
  private form: HTMLFormElement
  private scoreInput: HTMLInputElement
  private nameInput: HTMLInputElement
  private submissions: { name: string; score: number }[] = []
  private submitButton: HTMLButtonElement
  private spinnerElement: HTMLElement
  private submitButtonText: HTMLElement

  constructor(form: HTMLFormElement) {
    this.form = form
    this.scoreInput = this.form.querySelector('#score') as HTMLInputElement
    this.nameInput = this.form.querySelector('#name') as HTMLInputElement
    this.submitButton = this.form.querySelector('#submit') as HTMLButtonElement
    this.spinnerElement = this.form.querySelector('#spinner') as HTMLElement
    this.submitButtonText = this.form.querySelector('#submitButtonText') as HTMLElement
  }

  public showForm(score: number) {
    this.form.classList.remove('hidden')
    this.form.classList.add('grid')

    if (score > 0) {
      this.submitButton.classList.remove('hidden')
      this.nameInput.classList.remove('hidden')
      this.form.classList.add('grid-cols-2')
      this.form.classList.remove('grid-cols-[122px]')
    } else {
      this.nameInput.classList.add('hidden')
      this.form.classList.remove('grid-cols-2')
      this.form.classList.add('grid-cols-[122px]')
    }

    this.scoreInput.value = score.toString()
    this.nameInput.focus()
  }

  public hideForm() {
    this.form.classList.add('hidden')
    this.form.classList.remove('grid')
    this.submitButton.classList.add('hidden')
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
      ctx.fillText(`#${i + 1} ${submission.name} - ${submission.score}`, 300, (i + 12) * 30)
    }
  }

  public async submitForm(e: Event) {
    e.preventDefault()

    const data = new FormData(this.form)

    this.showSpinner()

    await axios.post('/leaderboard', data)

    this.hideSpinner()
  }

  private showSpinner() {
    this.submitButton.disabled = true
    this.spinnerElement.classList.remove('hidden')
    this.submitButtonText.classList.add('hidden')
  }

  private hideSpinner() {
    this.submitButton.disabled = false
    this.spinnerElement.classList.add('hidden')
    this.submitButtonText.classList.remove('hidden')
  }
}
