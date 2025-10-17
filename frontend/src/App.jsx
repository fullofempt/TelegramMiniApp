// import React, { useState, useEffect } from 'react'
// import ChatPage from './components/ChatPage'
// import WeatherPage from './components/WeatherPage'
// import SettingsPage from './components/SettingsPage'
// import TabBar from './components/TabBar'

// function App() {
//   const [activeTab, setActiveTab] = useState('chat')
//   const [isDarkMode, setIsDarkMode] = useState(false)

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }, [isDarkMode])

//   const renderPage = () => {
//     switch (activeTab) {
//       case 'chat':
//         return <ChatPage />
//       case 'weather':
//         return <WeatherPage />
//       case 'settings':
//         return <SettingsPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
//       default:
//         return <ChatPage />
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
//       <div className="container mx-auto px-4 pb-20 pt-4">
//         {renderPage()}
//       </div>
//       <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
//     </div>
//   )
// }

// export default App
import React from 'react'

function App() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>TEST - React Works!</h1>
      <p style={{ color: 'blue' }}>If you see this, React is rendering correctly.</p>
      <div style={{ backgroundColor: 'white', padding: '10px', margin: '10px' }}>
        This is a test div with inline styles
      </div>
    </div>
  )
}

export default App