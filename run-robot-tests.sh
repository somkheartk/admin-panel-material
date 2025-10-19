#!/bin/bash

# Script to run Robot Framework tests for Admin Panel

echo "========================================="
echo "Robot Framework Test Suite"
echo "========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "robot-venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv robot-venv
    source robot-venv/bin/activate
    pip install robotframework robotframework-seleniumlibrary
else
    source robot-venv/bin/activate
fi

echo "Virtual environment activated"
echo ""

# Check if servers are running
echo "Checking if frontend and backend servers are running..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "ERROR: Frontend server is not running on http://localhost:3000"
    echo "Please start the frontend server with: npm run dev"
    exit 1
fi

if ! curl -s http://localhost:3001 > /dev/null; then
    echo "ERROR: Backend server is not running on http://localhost:3001"
    echo "Please start the backend server with: cd backend && npm run dev"
    exit 1
fi

echo "Servers are running"
echo ""

# Run Robot Framework tests
echo "Running Robot Framework tests..."
echo ""

# Create output directory
mkdir -p test-results

# Run all tests
robot --outputdir test-results tests/robot/*.robot

# Display results
echo ""
echo "========================================="
echo "Test Results"
echo "========================================="
echo ""
echo "Results have been saved to: test-results/"
echo "Open test-results/report.html to view detailed report"
echo "Open test-results/log.html to view execution log"
echo ""

# Deactivate virtual environment
deactivate
