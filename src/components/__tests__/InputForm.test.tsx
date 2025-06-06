import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import InputForm from '../InputForm'
import { mockPortfolioData } from '@/test/test-utils'

describe('InputForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<InputForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/headline/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/skills/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/hobbies/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/github/i)).toBeInTheDocument()
  })

  it('initializes with provided data', () => {
    render(<InputForm onSubmit={mockOnSubmit} initialData={mockPortfolioData} />)

    expect(screen.getByDisplayValue(mockPortfolioData.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockPortfolioData.headline)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockPortfolioData.bio)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockPortfolioData.email)).toBeInTheDocument()
  })

  it('allows adding and removing skills', async () => {
    const user = userEvent.setup()
    render(<InputForm onSubmit={mockOnSubmit} />)

    const skillInput = screen.getByPlaceholderText(/add a skill/i)
    const addButton = screen.getByRole('button', { name: /add skill/i })

    await user.type(skillInput, 'JavaScript')
    await user.click(addButton)

    expect(screen.getByText('JavaScript')).toBeInTheDocument()

    // Remove skill
    const removeButton = screen.getByRole('button', { name: /remove javascript/i })
    await user.click(removeButton)

    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
  })

  it('allows adding and removing projects', async () => {
    const user = userEvent.setup()
    render(<InputForm onSubmit={mockOnSubmit} />)

    // Initially has one project
    expect(screen.getAllByText(/project \d+/i)).toHaveLength(1)

    // Add project
    const addProjectButton = screen.getByRole('button', { name: /add project/i })
    await user.click(addProjectButton)

    expect(screen.getAllByText(/project \d+/i)).toHaveLength(2)

    // Remove project
    const removeButtons = screen.getAllByRole('button', { name: /remove project/i })
    await user.click(removeButtons[0])

    expect(screen.getAllByText(/project \d+/i)).toHaveLength(1)
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<InputForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /generate my portfolio/i })
    await user.click(submitButton)

    // Form should not submit without required fields
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<InputForm onSubmit={mockOnSubmit} />)

    // Fill required fields
    await user.type(screen.getByLabelText(/your name/i), 'John Doe')
    await user.type(screen.getByLabelText(/headline/i), 'Developer')
    await user.type(screen.getByLabelText(/bio/i), 'I am a developer')
    await user.type(screen.getByLabelText(/hobbies/i), 'Coding')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')

    const submitButton = screen.getByRole('button', { name: /generate my portfolio/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          headline: 'Developer',
          bio: 'I am a developer',
          hobbies: 'Coding',
          email: 'john@example.com'
        })
      )
    })
  })

  it('handles project skill management', async () => {
    const user = userEvent.setup()
    render(<InputForm onSubmit={mockOnSubmit} />)

    // Add skill to first project
    const projectSkillInput = screen.getByPlaceholderText(/add project skill/i)
    await user.type(projectSkillInput, 'React')
    
    const addProjectSkillButton = screen.getByRole('button', { name: /add project skill/i })
    await user.click(addProjectSkillButton)

    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
