import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock portfolio data for tests
export const mockPortfolioData = {
  name: 'John Doe',
  headline: 'Full-Stack Developer',
  bio: 'I am a passionate developer with experience in modern web technologies.',
  skills: ['JavaScript', 'React', 'Node.js'],
  projects: [
    {
      title: 'Test Project',
      description: 'A test project description',
      skillsUsed: ['React', 'TypeScript']
    }
  ],
  hobbies: 'Reading, coding, hiking',
  email: 'john@example.com',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe'
}
