import axios from 'axios'

export default class Leaderboard {
  private form: HTMLFormElement

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

  public fetchSubmissions() {}

  public submitForm(e: Event) {
    e.preventDefault()
    const data = new FormData(this.form)
    axios.post('/leaderboard', data)
  }
}
