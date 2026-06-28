'use client'

import { Children, isValidElement, useState, type ReactElement, type ReactNode } from 'react'

interface TabProps {
  id: string
  label: string
  icon: ReactNode
  badge?: string
  children: ReactNode
}

// Marker component — its props are read by <SettingsTabs>. Renders nothing itself.
export function SettingsTab(_props: TabProps) {
  return null
}

// Vertical settings navigation (left) + content panel (right) — the standard
// pattern for SaaS settings with many sections. Shows one section at a time.
export function SettingsTabs({ children }: { children: ReactNode }) {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[]
  const [active, setActive] = useState(tabs[0]?.props.id)

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Nav */}
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:w-60 lg:flex-shrink-0 pb-2 lg:pb-0">
        {tabs.map(tab => {
          const isActive = active === tab.props.id
          return (
            <button
              key={tab.props.id}
              type="button"
              onClick={() => setActive(tab.props.id)}
              className={`flex items-center gap-3 whitespace-nowrap px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>{tab.props.icon}</span>
              {tab.props.label}
              {tab.props.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {tab.props.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {tabs.map(tab => (
          <div key={tab.props.id} className={`${active === tab.props.id ? 'space-y-6' : 'hidden'} max-w-3xl`}>
            {tab.props.children}
          </div>
        ))}
      </div>
    </div>
  )
}
