import { PortfolioData } from '@/services/api';
import { safeJsonParse } from './error-utils';

// Storage keys
const PORTFOLIO_DATA_KEY = 'portfolioai_data';
const PORTFOLIO_STEP_KEY = 'portfolioai_step';

/**
 * Save portfolio data to localStorage
 * @param data Portfolio data to save
 */
export const savePortfolioData = (data: PortfolioData | null): void => {
  try {
    if (data) {
      localStorage.setItem(PORTFOLIO_DATA_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(PORTFOLIO_DATA_KEY);
    }
  } catch (error) {
    console.error('Error saving portfolio data to localStorage:', error);
  }
};

/**
 * Load portfolio data from localStorage
 * @returns Saved portfolio data or null if not found
 */
export const loadPortfolioData = (): PortfolioData | null => {
  try {
    const savedData = localStorage.getItem(PORTFOLIO_DATA_KEY);
    if (!savedData) return null;
    
    return safeJsonParse<PortfolioData>(savedData, null);
  } catch (error) {
    console.error('Error loading portfolio data from localStorage:', error);
    return null;
  }
};

/**
 * Save current application step to localStorage
 * @param step Current application step
 */
export const saveCurrentStep = (step: 'form' | 'loading' | 'portfolio'): void => {
  try {
    localStorage.setItem(PORTFOLIO_STEP_KEY, step);
  } catch (error) {
    console.error('Error saving current step to localStorage:', error);
  }
};

/**
 * Load current application step from localStorage
 * @returns Saved step or 'form' if not found
 */
export const loadCurrentStep = (): 'form' | 'loading' | 'portfolio' => {
  try {
    const savedStep = localStorage.getItem(PORTFOLIO_STEP_KEY) as 'form' | 'loading' | 'portfolio' | null;
    return savedStep || 'form';
  } catch (error) {
    console.error('Error loading current step from localStorage:', error);
    return 'form';
  }
};

/**
 * Clear all saved portfolio data from localStorage
 */
export const clearSavedData = (): void => {
  try {
    localStorage.removeItem(PORTFOLIO_DATA_KEY);
    localStorage.removeItem(PORTFOLIO_STEP_KEY);
  } catch (error) {
    console.error('Error clearing saved data from localStorage:', error);
  }
};
