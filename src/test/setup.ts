import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.VITE_GROQ_API_KEY = 'test-api-key'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock fetch for API tests
global.fetch = vi.fn()

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}))
