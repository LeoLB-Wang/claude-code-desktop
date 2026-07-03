import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Settings } from '../pages/Settings'
import { useSettingsStore } from '../stores/settingsStore'
import { SKILL_CENTER_TAB_ID, useTabStore } from '../stores/tabStore'
import { useUIStore } from '../stores/uiStore'

vi.mock('../api/agents', () => ({
  agentsApi: {
    list: vi.fn().mockResolvedValue({ activeAgents: [], allAgents: [] }),
  },
}))

vi.mock('../stores/providerStore', () => ({
  useProviderStore: () => ({
    providers: [],
    activeId: null,
    presets: [],
    isLoading: false,
    isPresetsLoading: false,
    fetchProviders: vi.fn(),
    fetchPresets: vi.fn(),
    deleteProvider: vi.fn(),
    activateProvider: vi.fn(),
    activateOfficial: vi.fn(),
    testProvider: vi.fn(),
    createProvider: vi.fn(),
    updateProvider: vi.fn(),
    testConfig: vi.fn(),
  }),
}))

vi.mock('../pages/AdapterSettings', () => ({
  AdapterSettings: () => <div>Adapter Settings Mock</div>,
}))

vi.mock('../stores/agentStore', () => ({
  useAgentStore: () => ({
    activeAgents: [],
    allAgents: [],
    isLoading: false,
    error: null,
    selectedAgent: null,
    fetchAgents: vi.fn(),
    selectAgent: vi.fn(),
  }),
}))

describe('Settings > Skills compatibility entry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSettingsStore.setState({ locale: 'en' })
    useTabStore.setState(useTabStore.getInitialState(), true)
    useUIStore.setState({
      activeSettingsTab: 'providers',
      pendingSettingsTab: null,
    })
  })

  it('opens the unified Skill Center from the legacy settings tab button', () => {
    render(<Settings />)

    fireEvent.click(screen.getByText('Skills'))

    expect(useTabStore.getState().activeTabId).toBe(SKILL_CENTER_TAB_ID)
    expect(useTabStore.getState().tabs).toContainEqual({
      sessionId: SKILL_CENTER_TAB_ID,
      title: 'Skills',
      type: 'skill-center',
      status: 'idle',
    })
  })

  it('redirects pending legacy skills settings navigation to the Skill Center', async () => {
    useUIStore.setState({
      activeSettingsTab: 'providers',
      pendingSettingsTab: 'skills',
    })

    render(<Settings />)

    await waitFor(() => {
      expect(useTabStore.getState().activeTabId).toBe(SKILL_CENTER_TAB_ID)
    })
    expect(useUIStore.getState().pendingSettingsTab).toBeNull()
  })
})
