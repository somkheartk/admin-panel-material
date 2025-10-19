# Robot Framework Tests

This directory contains automated end-to-end tests using Robot Framework.

## Test Suites

- **dashboard.robot**: Tests for the main dashboard page
- **users.robot**: CRUD operations tests for Users management
- **products.robot**: CRUD operations tests for Products management  
- **analytics.robot**: Tests for Analytics page
- **settings.robot**: Tests for Settings page
- **common.robot**: Common keywords and variables shared across test suites

## Prerequisites

1. Python 3.7 or higher
2. Frontend server running on http://localhost:3000
3. Backend server running on http://localhost:3001
4. Chrome or Chromium browser installed

## Installation

The required packages will be installed automatically when running the test script:
- robotframework
- robotframework-seleniumlibrary

## Running Tests

### Option 1: Using the convenience script

```bash
./run-robot-tests.sh
```

This script will:
- Create/activate a Python virtual environment
- Install required dependencies
- Check if servers are running
- Run all test suites
- Generate HTML reports

### Option 2: Manual execution

1. Activate virtual environment:
```bash
source robot-venv/bin/activate
```

2. Run all tests:
```bash
robot --outputdir test-results tests/robot/*.robot
```

3. Run specific test suite:
```bash
robot --outputdir test-results tests/robot/dashboard.robot
```

4. Run specific test case:
```bash
robot --outputdir test-results --test "Dashboard Should Display Title" tests/robot/dashboard.robot
```

## Test Reports

After running tests, you can view:
- **test-results/report.html** - High-level test execution report
- **test-results/log.html** - Detailed execution log with screenshots
- **test-results/output.xml** - Raw test execution data

## Test Configuration

You can modify test behavior by editing variables in `common.robot`:

```robot
${BROWSER}        headlesschrome    # Browser to use (chrome, firefox, headlesschrome)
${BASE_URL}       http://localhost:3000
${BACKEND_URL}    http://localhost:3001
${DELAY}          0.5               # Delay between actions in seconds
```

## Writing New Tests

1. Create a new `.robot` file in `tests/robot/`
2. Import common resources:
```robot
*** Settings ***
Resource          common.robot
Suite Setup       Open Admin Panel
Suite Teardown    Close Admin Panel
```

3. Write test cases:
```robot
*** Test Cases ***
My Test Case
    [Documentation]    Description of the test
    Navigate To Page    /mypage
    Wait For Element    xpath=//h1[contains(., 'My Page')]
```

## Best Practices

- Use descriptive test case names
- Add documentation to test cases
- Use common keywords from `common.robot` for reusability
- Wait for elements before interacting with them
- Use appropriate timeouts for asynchronous operations
- Clean up test data after tests complete

## Troubleshooting

### Tests fail with "Connection refused"
- Ensure both frontend (port 3000) and backend (port 3001) servers are running

### Tests fail with "Element not found"
- Increase wait timeouts in test cases
- Check if the UI has changed and update selectors accordingly

### Browser doesn't start
- Install Chrome/Chromium: `sudo apt-get install chromium-browser`
- Or use a different browser: Change `${BROWSER}` variable in `common.robot`

## CI/CD Integration

To run tests in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Robot Framework Tests
  run: |
    python -m venv robot-venv
    source robot-venv/bin/activate
    pip install robotframework robotframework-seleniumlibrary
    robot --outputdir test-results tests/robot/*.robot
```
