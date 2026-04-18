import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import ProjectReportWall from './ProjectReportWall'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    /* flex-col ensures header, main, and footer stack vertically */
    /* overflow-x-hidden prevents the draggable notes from breaking the width */
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] w-full overflow-x-hidden">

      {/* HEADER: Z-index 50 to stay above draggable notes */}
      <nav className="p-6 bg-white border-b flex flex-col md:flex-row justify-between items-center shadow-sm gap-4 z-50">
        <div className="flex items-center gap-8">
          <div className="hero scale-75 md:scale-100 mr-4">
            <img src={heroImg} className="base" alt="Base" />
            <img src={reactLogo} className="framework animate-spin-slow" alt="React logo" />
            <img src={viteLogo} className="vite animate-pulse" alt="Vite logo" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">
              Aurum <span className="text-yellow-500">Capital</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              B.Tech Computer Engineering | Ledger v4.0
            </p>
          </div>
        </div>

        <button
          className="counter"
          onClick={() => setCount((c) => c + 1)}
        >
          Project Iterations: {count}
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      {/* Removed fixed min-h-screen to let the ProjectReportWall control the height */}
      <main className="flex-1 relative z-10 bg-[#0c0c0c]">
        <ProjectReportWall />
      </main>

      {/* FOOTER */}
      <footer className="bg-white p-10 border-t z-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div id="docs">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Technical Documentation</h2>
            <p className="text-sm text-gray-500 mb-4">
              Detailed breakdown of JavaFX controllers and MySQL schemas.
            </p>
            <div className="flex gap-3">
              <a href="https://vite.dev/" target="_blank" className="hover:shadow-lg transition-all border p-2 rounded-lg flex items-center gap-2 text-xs font-semibold bg-white">
                <img src={viteLogo} className="h-4" alt="" /> Vite Build
              </a>
              <a href="https://react.dev/" target="_blank" className="hover:shadow-lg transition-all border p-2 rounded-lg flex items-center gap-2 text-xs font-semibold bg-white">
                <img src={reactLogo} className="h-4" alt="" /> React Engine
              </a>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-100 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-bold uppercase text-xs tracking-tight">Tailwind v4 Active</p>
              <p className="text-yellow-600 text-[10px] font-medium">Styling engine optimized for production.</p>
            </div>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}