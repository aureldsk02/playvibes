# Testing Guide

## Overview

This project uses **Jest** and **React Testing Library** for unit and integration testing. Tests are configured to work seamlessly with Next.js 16.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are located in the `__tests__/` directory, mirroring the project structure:

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

```typescript
import { render, screen } from "@testing-library/react";
import { YourComponent } from "@/components/your-component";

describe("YourComponent", () => {
  it("renders correctly", () => {
    render(<YourComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### Utility Function Tests

```typescript
import { yourFunction } from "@/lib/your-utility";

describe("yourFunction", () => {
  it("returns expected result", () => {
    const result = yourFunction("input");
    expect(result).toBe("expected output");
  });
});
```

## Coverage Thresholds

The project maintains minimum coverage thresholds:
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

## Pre-commit Hooks

Husky is configured to run linting and formatting before each commit:

```bash
# Automatically runs on git commit
- ESLint with auto-fix
- Prettier formatting
```

## Code Quality Scripts

```bash
# Lint code
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how it does it
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Keep tests simple** - One assertion per test when possible
4. **Mock external dependencies** - Use Jest mocks for API calls, external libraries
5. **Test accessibility** - Ensure components are accessible to screen readers

## Example Tests

See the following files for examples:
- `__tests__/components/ui/button.test.tsx` - Component testing
- `__tests__/lib/utils.test.ts` - Utility function testing

## Troubleshooting

### Tests not running?
- Ensure all dependencies are installed: `npm install`
- Check Jest configuration in `jest.config.js`

### Import errors?
- Verify path aliases in `jest.config.js` match `tsconfig.json`

### Coverage not generating?
- Run `npm run test:coverage` explicitly
- Check `collectCoverageFrom` in `jest.config.js`
