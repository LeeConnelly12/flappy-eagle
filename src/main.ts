import './style.css'
import Game from '@/Game'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

new Game()
