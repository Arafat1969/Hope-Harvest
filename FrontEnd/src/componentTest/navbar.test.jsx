import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/navbar";

const mockLogout = jest.fn();
const renderNavbar = (props = {}) => {
  const defaultProps = {
    isAuthenticated: false,
    user: null,
    onLogout: mockLogout,
  };
  return render(
    <MemoryRouter>
      <Navbar {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe("Navbar Component", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it("shows login button when not authenticated", () => {
    renderNavbar();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("shows dashboard and profile when authenticated as user", () => {
    renderNavbar({ isAuthenticated: true, user: { role: "USER" } });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("shows admin links when authenticated as admin", () => {
    renderNavbar({ isAuthenticated: true, user: { role: "ADMIN" } });
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
  });

  it("calls logout handler when logout clicked", () => {
    renderNavbar({ isAuthenticated: true, user: { role: "USER" } });
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("matches snapshot for guest user", () => {
    const { asFragment } = renderNavbar();
    expect(asFragment()).toMatchSnapshot();
  });
});