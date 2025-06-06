import { describe, it, expect, vi } from 'vitest'
import { handleApiError } from '../error-utils'
import { toast } from '@/components/ui/use-toast'

vi.mock('@/components/ui/use-toast')

describe('Error Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle Error objects', () => {
    const error = new Error('Test error message')

    handleApiError(error, 'Operation failed')

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Test error message',
      variant: 'destructive',
      duration: 5000
    })
  })

  it('should handle string errors', () => {
    const error = 'String error message'

    handleApiError(error, 'Operation failed')

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Operation failed',
      variant: 'destructive',
      duration: 5000
    })
  })

  it('should handle unknown error types', () => {
    const error = { someProperty: 'value' }

    handleApiError(error, 'Operation failed')

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Operation failed',
      variant: 'destructive',
      duration: 5000
    })
  })

  it('should handle null/undefined errors', () => {
    handleApiError(null, 'Operation failed')

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Operation failed',
      variant: 'destructive',
      duration: 5000
    })
  })

  it('should use default title when not provided', () => {
    const error = new Error('Test error')

    handleApiError(error)

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Test error',
      variant: 'destructive',
      duration: 5000
    })
  })
})
