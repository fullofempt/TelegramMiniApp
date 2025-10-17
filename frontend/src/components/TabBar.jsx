import React from 'react'
import { FaComment, FaCloudSun, FaCog } from 'react-icons/fa'

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chat', label: 'Чат', icon: FaComment },
    { id: 'weather', label: 'Погода', icon: FaCloudSun },
    { id: 'settings', label: 'Настройки', icon: FaCog }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-[var(--border-color)] shadow-lg">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-20 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabBar
