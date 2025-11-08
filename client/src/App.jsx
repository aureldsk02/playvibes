import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import SharePlaylist from './pages/SharePlaylist'
import PlaylistDetail from './pages/PlaylistDetail'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/share" element={<SharePlaylist />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
