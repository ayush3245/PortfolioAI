import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import Index from '@/pages/Index'

// Mock the API service
const mockSupabase = {
  functions: {
    invoke: vi.fn()
  }
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}))

describe('Portfolio Generation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear localStorage
    localStorage.clear()
  })

  it('should complete the full portfolio generation flow', async () => {
    const user = userEvent.setup()

    // Mock successful API response
    const mockResponse = {
      success: true,
      data: {
        enhancedBio: 'Enhanced professional bio',
        enhancedProjects: [
          {
            title: 'Test Project',
            description: 'Enhanced project description with metrics and impact',
            skillsUsed: ['React', 'TypeScript']
          }
        ],
        enhancedHobbies: 'Enhanced hobbies description'
      }
    }

    mockSupabase.functions.invoke.mockResolvedValue({
      data: mockResponse,
      error: null
    })

    render(<Index />)

    // Should start with the form
    expect(screen.getByText(/your portfolio details/i)).toBeInTheDocument()

    // Fill out the form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/headline/i), 'Full-Stack Developer')
    await user.type(screen.getByLabelText(/bio/i), 'I am a passionate developer')
    await user.type(screen.getByLabelText(/hobbies/i), 'Coding, reading')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')

    // Add a skill
    const skillInput = screen.getByPlaceholderText(/add a skill/i)
    await user.type(skillInput, 'React')
    await user.click(screen.getByRole('button', { name: /add skill/i }))

    // Fill project details
    const projectTitle = screen.getByLabelText(/project title/i)
    const projectDescription = screen.getByLabelText(/project description/i)
    
    await user.type(projectTitle, 'Test Project')
    await user.type(projectDescription, 'A test project')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /generate my portfolio/i })
    await user.click(submitButton)

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/generating your portfolio/i)).toBeInTheDocument()
    })

    // Should eventually show the portfolio
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Enhanced professional bio')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Verify API was called
    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('enhance-portfolio', {
      body: {
        bio: 'I am a passionate developer',
        projects: [
          {
            title: 'Test Project',
            description: 'A test project',
            skillsUsed: []
          }
        ],
        hobbies: 'Coding, reading'
      }
    })
  })

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup()

    // Mock API error
    mockSupabase.functions.invoke.mockResolvedValue({
      data: null,
      error: { message: 'API Error' }
    })

    render(<Index />)

    // Fill minimal form data
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/headline/i), 'Developer')
    await user.type(screen.getByLabelText(/bio/i), 'Bio')
    await user.type(screen.getByLabelText(/hobbies/i), 'Hobbies')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /generate my portfolio/i }))

    // Should still show portfolio with original data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Bio')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('should persist data in localStorage', async () => {
    const user = userEvent.setup()

    render(<Index />)

    // Fill form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/headline/i), 'Developer')

    // Check localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should restore data from localStorage on page load', () => {
    const savedData = {
      name: 'Saved User',
      headline: 'Saved Headline',
      bio: 'Saved bio',
      skills: ['JavaScript'],
      projects: [],
      hobbies: 'Saved hobbies',
      email: 'saved@example.com',
      linkedin: '',
      github: ''
    }

    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'portfolioai_data') return JSON.stringify(savedData)
      if (key === 'portfolioai_step') return 'form'
      return null
    })

    render(<Index />)

    expect(screen.getByDisplayValue('Saved User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Saved Headline')).toBeInTheDocument()
  })
})
