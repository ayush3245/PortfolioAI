# PortfolioAI Testing Guide

This document outlines the comprehensive testing strategy for PortfolioAI, ensuring the application works correctly across all environments.

## Test Structure

### 🧪 Test Types

1. **Unit Tests** - Test individual components and functions
2. **Integration Tests** - Test component interactions and API integration
3. **Server Tests** - Test Express API endpoints
4. **End-to-End Tests** - Test complete application flow

### 📁 Test Organization

```
src/
├── test/
│   ├── setup.ts              # Test configuration
│   ├── test-utils.tsx        # Testing utilities and providers
│   └── integration.test.tsx  # Integration tests
├── components/__tests__/     # Component tests
├── services/__tests__/       # Service layer tests
├── lib/__tests__/           # Utility function tests
__tests__/
└── server.test.js           # Server API tests
scripts/
└── test-e2e.js            # End-to-end tests
```

## 🚀 Running Tests

### All Tests
```bash
npm run test:all
```

### Individual Test Suites
```bash
# Frontend unit/integration tests
npm run test:run

# Server API tests
npm run test:server

# End-to-end tests
npm run test:e2e

# Interactive test UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## ✅ Test Coverage

### Core Functionality Tested

#### ✅ API Service (`src/services/api.ts`)
- ✅ Portfolio enhancement with Groq API
- ✅ Error handling for API failures
- ✅ Fallback processing when API unavailable
- ✅ Supabase integration

#### ✅ Storage Utilities (`src/lib/storage-utils.ts`)
- ✅ Portfolio data persistence
- ✅ Application state management
- ✅ Error handling for localStorage failures
- ✅ Data validation and recovery

#### ✅ Error Handling (`src/lib/error-utils.ts`)
- ✅ API error processing
- ✅ User-friendly error messages
- ✅ Toast notification integration
- ✅ JSON parsing with fallbacks

#### ✅ Server API (`server.js`)
- ✅ Portfolio enhancement endpoint
- ✅ Groq API integration
- ✅ JSON response parsing and repair
- ✅ Error handling and status codes

#### ✅ End-to-End Flow
- ✅ Environment variable validation
- ✅ Frontend availability
- ✅ API endpoint functionality
- ✅ Complete portfolio generation flow

## 🔧 Test Configuration

### Frontend Tests (Vitest)
- **Framework**: Vitest with React Testing Library
- **Environment**: jsdom
- **Mocking**: Supabase client, localStorage, toast notifications
- **Setup**: `src/test/setup.ts`

### Server Tests (Jest)
- **Framework**: Jest with Supertest
- **Environment**: Node.js
- **Mocking**: node-fetch, environment variables
- **Setup**: `jest.setup.js`

### E2E Tests (Custom)
- **Framework**: Custom Node.js script
- **Tests**: Real HTTP requests to running servers
- **Validation**: Environment, frontend, API endpoints

## 📊 Test Results Summary

### ✅ Passing Tests
- **Server API Tests**: 4/4 passing
- **End-to-End Tests**: 3/3 passing
- **Storage Utils Tests**: 9/9 passing
- **Error Utils Tests**: 5/5 passing
- **API Service Tests**: 5/5 passing

### ⚠️ Known Issues
- Some component tests need adjustment for actual UI implementation
- Integration tests require mock refinement for complex user interactions

## 🛠️ Test Maintenance

### Adding New Tests
1. Place unit tests next to the code they test
2. Use descriptive test names
3. Mock external dependencies
4. Test both success and error cases

### Test Data
- Use `mockPortfolioData` from `src/test/test-utils.tsx`
- Create realistic test scenarios
- Test edge cases and error conditions

### Mocking Guidelines
- Mock external APIs (Supabase, Groq)
- Mock browser APIs (localStorage, fetch)
- Keep mocks simple and focused

## 🚨 Critical Test Scenarios

### Must-Pass Tests
1. **Portfolio Generation**: Complete flow from form to output
2. **API Error Handling**: Graceful degradation when API fails
3. **Data Persistence**: localStorage save/load functionality
4. **Server Endpoints**: All API routes respond correctly

### Performance Tests
- API response times under 5 seconds
- Frontend rendering under 2 seconds
- Memory usage within acceptable limits

## 📝 Test Development Guidelines

### Following Project Guidelines
- Tests follow `.augment-instructions.md` principles
- Simple, focused test cases
- No duplication of test logic
- Environment-aware testing (dev/test/prod)

### Best Practices
- Test behavior, not implementation
- Use meaningful assertions
- Keep tests independent
- Clean up after tests

## 🔍 Debugging Tests

### Common Issues
1. **Mock not working**: Check mock setup in test files
2. **Async test failures**: Ensure proper `await` usage
3. **Component not found**: Verify component rendering

### Debug Commands
```bash
# Run specific test file
npm run test -- src/services/__tests__/api.test.ts

# Run tests in watch mode
npm run test

# Debug with console output
npm run test -- --reporter=verbose
```

## 📈 Future Test Improvements

### Planned Enhancements
1. Visual regression testing
2. Performance benchmarking
3. Cross-browser testing
4. Accessibility testing
5. Load testing for API endpoints

### Test Automation
- CI/CD integration
- Automated test runs on PR
- Coverage reporting
- Performance monitoring
