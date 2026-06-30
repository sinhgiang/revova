'use client'

import { Children, isValidElement, useState, type ReactElement, type ReactNode } from 'react'

interface TabProps {
  id: string
  label: string
  icon: ReactNode
  badge?: string | number
  children: ReactNode
}

// Marker — its props are read by <AdminTabs>. Renders nothing itself.
export function AdminTab(_props: TabProps) {
  return null
}

// Left sidebar navigation + content panel for the admin console, so the founder
// can jump straight to a section instead of scrolling one long page.
export function AdminTabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[]
  const [active, setActive] = useState(tabs[0]?.props.id)

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:w-52 lg:flex-shrink-0 pb-1 lg:pb-0">
        {tabs.map(tab => {
          const isActive = active === tab.props.id
          return (
            <button
              key={tab.props.id}
              type="button"
              onClick={() => setActive(tab.props.id)}
              className={`flex items-center gap-3 whitespace-nowrap px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{tab.props.icon}</span>
              {tab.props.label}
              {tab.props.badge !== undefined && tab.props.badge !== 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {tab.props.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="flex-1 min-w-0 space-y-6">
        {tabs.map(tab => (
          <div key={tab.props.id} className={active === tab.props.id ? 'space-y-6' : 'hidden'}>
            {tab.props.children}
          </div>
        ))}
      </div>
    </div>
  )
}
