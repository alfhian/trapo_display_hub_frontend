import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Trapo Display Frontend</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div className="mt-6 p-4 bg-green-500 text-white rounded shadow text-center">
      Tailwind CSS is working perfectly 🎉
      </div>
      <>
      <p>
      </p>
      </>
        <button className="hover:bg-red-800 md:text-xl">
      TV BUSUK
      </button>

      <p className="read-the-docs">
        Trapo Display Frontend
      </p>
    </>
  )
}

export default App
