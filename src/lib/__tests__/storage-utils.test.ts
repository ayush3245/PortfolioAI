import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  savePortfolioData,
  loadPortfolioData,
  saveCurrentStep,
  loadCurrentStep
} from '../storage-utils'
import { mockPortfolioData } from '@/test/test-utils'

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Portfolio Data Storage', () => {
    it('should save portfolio data to localStorage', () => {
      savePortfolioData(mockPortfolioData)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'portfolioai_data',
        JSON.stringify(mockPortfolioData)
      )
    })

    it('should load portfolio data from localStorage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockPortfolioData))

      const result = loadPortfolioData()

      expect(localStorage.getItem).toHaveBeenCalledWith('portfolioai_data')
      expect(result).toEqual(mockPortfolioData)
    })

    it('should return null when no data exists', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      
      const result = loadPortfolioData()
      
      expect(result).toBeNull()
    })

    it('should handle invalid JSON gracefully', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid json')
      
      const result = loadPortfolioData()
      
      expect(result).toBeNull()
    })

    it('should handle null data when saving', () => {
      savePortfolioData(null)

      expect(localStorage.removeItem).toHaveBeenCalledWith('portfolioai_data')
    })
  })

  describe('Current Step Storage', () => {
    it('should save current step to localStorage', () => {
      saveCurrentStep('portfolio')

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolioai_step', 'portfolio')
    })

    it('should load current step from localStorage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('loading')

      const result = loadCurrentStep()

      expect(localStorage.getItem).toHaveBeenCalledWith('portfolioai_step')
      expect(result).toBe('loading')
    })

    it('should return default step when no data exists', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      
      const result = loadCurrentStep()
      
      expect(result).toBe('form')
    })

    it('should return invalid step as-is (no validation in current implementation)', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-step')

      const result = loadCurrentStep()

      expect(result).toBe('invalid-step')
    })
  })
})
