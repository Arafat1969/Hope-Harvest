// jest.setup.js
import React from "react";
import "@testing-library/jest-dom";

// 1) Use modern fake timers so advanceTimersByTime actually works
beforeEach(() => {
  jest.useFakeTimers("modern");
});

// 2) Mock react-router-dom components used in your app
jest.mock("react-router-dom", () => ({
  // For components wrapped in <BrowserRouter> or <MemoryRouter>
  BrowserRouter: ({ children }) => <>{children}</>,
  MemoryRouter: ({ children }) => <>{children}</>,

  // Link just renders its children as an <a>
  Link: ({ children, to, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),

  // Routes/Navigate/Route stubs
  Routes: ({ children }) => <>{children}</>,
  Route: ({ element }) => element,
  Navigate: () => null,
}));
