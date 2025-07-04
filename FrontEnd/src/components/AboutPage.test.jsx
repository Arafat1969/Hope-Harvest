// src/components/AboutPage.test.jsx
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AboutPage from "./AboutPage.jsx";

describe("AboutPage Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
  });

  it("renders default introduction content (h2 only)", () => {
    const introHeading = screen.getByRole("heading", {
      level: 2,
      name: "Introduction",
    });
    expect(introHeading).toBeInTheDocument();
  });

  it("displays exactly seven sidebar menu items", () => {
    const sidebarContainer = screen
      .getByText("Explore Our Story")
      .closest("div.sidebarContainer");
    const list = within(sidebarContainer).getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items.map((li) => li.textContent.trim())).toEqual([
      "Introduction",
      "Principles and Norms",
      "Goals and Objectives",
      "Activities",
      "Sources of funds",
      "Expenditure policy",
      "Achievements",
    ]);
  });

  it("switches content when menu items are clicked", () => {
    // Locate the sidebar list
    const sidebarContainer = screen
      .getByText("Explore Our Story")
      .closest("div.sidebarContainer");
    const list = within(sidebarContainer).getByRole("list");

    // Click the "Principles and Norms" item by its text
    const normsItem = within(list).getByText("Principles and Norms");
    fireEvent.click(normsItem);

    // Assert the main content heading updates
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Principles and Norms",
      })
    ).toBeInTheDocument();

    // Assert that the first bullet includes "Transparency:"
    expect(screen.getByText(/Transparency:/)).toBeInTheDocument();
  });

  it("displays hero statistics", () => {
    expect(
      screen.getByRole("heading", { level: 4, name: "2025" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "25K+" })
    ).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});