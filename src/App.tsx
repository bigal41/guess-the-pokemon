import pokeballIcon from './assets/pokeball-icon.svg'
import './App.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

function App() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      navigate('home', { replace: true })
    }
  }, [loading, navigate])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-splash px-6 text-center">
      <img
        src={pokeballIcon}
        className="animate-bounce"
        alt="Vite logo"
        height={145}
        width={145}
      />
      <h1 className="mt-4 max-w-[12rem] text-balance font-nunito text-3xl leading-none font-black uppercase text-neutral-50 sm:max-w-none sm:text-4xl">
        guess the pokemon
      </h1>
    </div>
  )
}

export default App
