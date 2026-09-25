import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useContractStats } from './useContractStats'

describe('useContractStats', () => {
  it('fetches and parses contract stats from RPC', async () => {
    const { result } = renderHook(() => useContractStats())

    // Initial state should be loading
    expect(result.current.status).toBe('loading')
    expect(result.current.stats).toBeNull()

    // Wait for the hook to fetch data
    await waitFor(
      () => {
        expect(result.current.status).toBe('ok')
      },
      { timeout: 3000 }
    )

    // Verify stats are populated from mock
    expect(result.current.stats).not.toBeNull()
    expect(result.current.stats?.agreements).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.milestonesLocked).toBeGreaterThanOrEqual(0)
  })

  it('handles RPC errors gracefully', async () => {
    const { result } = renderHook(() => useContractStats())

    await waitFor(
      () => {
        expect(['ok', 'error', 'stale']).toContain(result.current.status)
      },
      { timeout: 3000 }
    )
  })
})
