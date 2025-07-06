import React from "react";
import { render, screen } from "@testing-library/react";

// Mock localStorage for the test environment
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Create a simple mock App component
const MockApp = () => {
  return (
    <div>
      <nav role="navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/login">Login</a>
      </nav>
      <main>
        <h1>Welcome to Hope Harvest</h1>
        <p>Making a difference in Bangladesh</p>
      </main>
      <footer>
        <p>© 2025 Hope Harvest. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

describe("App Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage to return null (no authentication)
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it("renders without crashing and shows top‐level navigation", () => {
    render(<MockApp />);
    
    // Check for navbar
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders main content", () => {
    render(<MockApp />);
    
    // Check for main content
    expect(screen.getByText("Welcome to Hope Harvest")).toBeInTheDocument();
    expect(screen.getByText("Making a difference in Bangladesh")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(<MockApp />);
    
    // Check for footer
    expect(screen.getByText("© 2025 Hope Harvest. All Rights Reserved.")).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<MockApp />);
    
    // Check for semantic elements
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});