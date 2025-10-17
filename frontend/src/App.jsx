import React, { useState } from 'react'
import TabBar from './components/TabBar'

function App() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="container mx-auto px-4 pb-20 pt-4">
      </div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default App