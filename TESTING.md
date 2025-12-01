# Testing Guide

Comprehensive testing guide for PlayVibes.

## Test Stack

- **Framework**: Jest 29
- **React Testing**: React Testing Library
- **Coverage**: Istanbul (via Jest)
- **Pre-commit**: Husky + lint-staged

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test button.test.tsx

# Update snapshots
npm test -- -u
```

## Test Structure

```
__tests__/
├── components/
│   └── ui/
│       └── button.test.tsx
└── lib/
    └── utils.test.ts
```

## Writing Tests

### Component Tests

Example: Testing a Button component

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Function Tests

Example: Testing a utility function

```typescript
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar')).toBe('foo');
  });
});
```

## Test Coverage

Current coverage targets:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

View coverage report:

```bash
npm run test:coverage
# Opens coverage/lcov-report/index.html
```

## Mocking

### Mocking Modules

Example: Mocking nanoid

```typescript
// __mocks__/nanoid.ts
export const nanoid = () => 'test-id-123';
```

### Mocking API Calls

```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock;
```

## Pre-commit Hooks

Husky runs automatically before each commit:

1. **lint-staged**: Runs on staged files only
2. **ESLint**: Checks for code issues
3. **Prettier**: Formats code

Configuration in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## Best Practices

### 1. Test Behavior, Not Implementation

**Good**:
```typescript
it('displays user name after login', () => {
  // Test what user sees
});
```

**Bad**:
```typescript
it('calls setState with user data', () => {
  // Testing implementation details
});
```

### 2. Use Descriptive Test Names

**Good**: `it('shows error message when email is invalid')`

**Bad**: `it('works')`

### 3. Arrange-Act-Assert Pattern

```typescript
it('increments counter on button click', () => {
  // Arrange
  render(<Counter />);
  
  // Act
  screen.getByRole('button').click();
  
  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 4. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

## Debugging Tests

### Run Single Test

```bash
npm test -- -t "test name pattern"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### Verbose Output

```bash
npm test -- --verbose
```

## Common Issues

### Tests Timing Out

Increase timeout:

```typescript
jest.setTimeout(10000); // 10 seconds
```

### Module Not Found

Check `jest.config.js` moduleNameMapper:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### ESM Module Errors

Add to `transformIgnorePatterns` in `jest.config.js`:

```javascript
transformIgnorePatterns: [
  'node_modules/(?!(module-name)/)',
]
```

## CI/CD Integration

Tests run automatically on:
- Pre-commit (via Husky)
- Pull requests (GitHub Actions)
- Before deployment

## Future Improvements

- [ ] E2E tests with Playwright
- [ ] Visual regression testing
- [ ] API integration tests
- [ ] Performance testing
- [ ] Accessibility testing (jest-axe)

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
