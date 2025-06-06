import { describe, it, expect, vi, beforeEach } from 'vitest'
import { processPortfolioWithGroq, isSupabaseConnected } from '../api'
import { mockPortfolioData } from '@/test/test-utils'

// Mock the supabase client
const mockSupabase = {
  functions: {
    invoke: vi.fn()
  }
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}))

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('processPortfolioWithGroq', () => {
    it('should successfully process portfolio data', async () => {
      const mockResponse = {
        success: true,
        data: {
          enhancedBio: 'Enhanced bio content',
          enhancedProjects: [
            {
              title: 'Test Project',
              description: 'Enhanced project description',
              skillsUsed: ['React', 'TypeScript']
            }
          ],
          enhancedHobbies: 'Enhanced hobbies'
        }
      }

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null
      })

      const result = await processPortfolioWithGroq(mockPortfolioData)

      expect(result).toEqual({
        ...mockPortfolioData,
        bio: 'Enhanced bio content',
        projects: mockResponse.data.enhancedProjects,
        hobbies: 'Enhanced hobbies'
      })
    })

    it('should handle API errors gracefully', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'API Error' }
      })

      const result = await processPortfolioWithGroq(mockPortfolioData)

      // Should return fallback processed data
      expect(result).toEqual({
        ...mockPortfolioData,
        bio: mockPortfolioData.bio.trim(),
        projects: mockPortfolioData.projects.map(project => ({
          ...project,
          description: project.description.trim()
        })),
        hobbies: mockPortfolioData.hobbies.trim()
      })
    })

    it('should handle network errors', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('Network error'))

      const result = await processPortfolioWithGroq(mockPortfolioData)

      // Should return fallback processed data
      expect(result).toEqual({
        ...mockPortfolioData,
        bio: mockPortfolioData.bio.trim(),
        projects: mockPortfolioData.projects.map(project => ({
          ...project,
          description: project.description.trim()
        })),
        hobbies: mockPortfolioData.hobbies.trim()
      })
    })

    it('should handle unsuccessful API response', async () => {
      const mockResponse = {
        success: false,
        error: 'Processing failed'
      }

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null
      })

      const result = await processPortfolioWithGroq(mockPortfolioData)

      // Should return fallback processed data
      expect(result).toEqual({
        ...mockPortfolioData,
        bio: mockPortfolioData.bio.trim(),
        projects: mockPortfolioData.projects.map(project => ({
          ...project,
          description: project.description.trim()
        })),
        hobbies: mockPortfolioData.hobbies.trim()
      })
    })
  })

  describe('isSupabaseConnected', () => {
    it('should return true when supabase client exists', () => {
      const result = isSupabaseConnected()
      expect(result).toBe(true)
    })
  })
})
