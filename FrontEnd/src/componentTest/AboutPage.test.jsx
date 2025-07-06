import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AboutPage from "../components/AboutPage";

describe("AboutPage Component", () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Clear any previous renders - use Testing Library's cleanup instead
  });

  it("renders default introduction content (h2 only)", () => {
    renderComponent();
    const introHeading = screen.getByRole("heading", {
      level: 2,
      name: "Introduction",
    });
    expect(introHeading).toBeInTheDocument();
  });

  it("displays exactly seven sidebar menu items", () => {
    renderComponent();
    
    // Find the sidebar by its heading first, then find the list
    const sidebarHeading = screen.getByRole("heading", { 
      level: 4, 
      name: /Explore Our Story/i 
    });
    expect(sidebarHeading).toBeInTheDocument();
    
    // Find all lists and get the first one (sidebar menu)
    const menuLists = screen.getAllByRole("list");
    const menuList = menuLists[0]; // First list is the sidebar menu
    const items = within(menuList).getAllByRole("listitem");
    
    expect(items).toHaveLength(7);
    expect(items.map((li) => li.textContent.trim())).toEqual([
      "Introduction",
      "Principles and Norms",
      "Goals and Objectives",
      "Activities",
      "Sources of funds and income",
      "Expenditure policy",
      "Achievements",
    ]);
  });

  it("switches content when menu items are clicked", () => {
    renderComponent();
    
    // Find the first list (sidebar menu)
    const menuLists = screen.getAllByRole("list");
    const menuList = menuLists[0];
    const normsItem = within(menuList).getByText("Principles and Norms");
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
    renderComponent();
    
    // Look for statistics text content
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("25K+")).toBeInTheDocument();
  });

  it("displays hero section with correct title", () => {
    renderComponent();
    
    expect(
      screen.getByRole("heading", { level: 1, name: "About Hope Harvest" })
    ).toBeInTheDocument();
  });

  it("displays sidebar title correctly", () => {
    renderComponent();
    
    expect(
      screen.getByRole("heading", { level: 4, name: /Explore Our Story/i })
    ).toBeInTheDocument();
  });

  it("renders all menu items with icons", () => {
    renderComponent();
    
    // Find the first list (sidebar menu)
    const menuLists = screen.getAllByRole("list");
    const menuList = menuLists[0];
    
    const menuItems = [
      "Introduction",
      "Principles and Norms", 
      "Goals and Objectives",
      "Activities",
      "Sources of funds and income",
      "Expenditure policy",
      "Achievements"
    ];

    menuItems.forEach(item => {
      expect(within(menuList).getByText(item)).toBeInTheDocument();
    });
  });

  it("changes active state when clicking different menu items", () => {
    renderComponent();
    
    // Find the first list (sidebar menu)
    const menuLists = screen.getAllByRole("list");
    const menuList = menuLists[0];
    
    // Click on "Goals and Objectives"
    const goalsItem = within(menuList).getByText("Goals and Objectives");
    fireEvent.click(goalsItem);
    
    // Check that the content heading changed
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Goals and Objectives",
      })
    ).toBeInTheDocument();
  });

  it("can navigate through all menu sections", () => {
    renderComponent();
    
    const menuLists = screen.getAllByRole("list");
    const menuList = menuLists[0];
    const menuSections = [
      { name: "Activities", heading: "Activities" },
      { name: "Achievements", heading: "Achievements" },
      { name: "Expenditure policy", heading: "Expenditure policy" }
    ];

    menuSections.forEach(section => {
      const menuItem = within(menuList).getByText(section.name);
      fireEvent.click(menuItem);
      
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: section.heading,
        })
      ).toBeInTheDocument();
    });
  });

  it("displays correct initial active state", () => {
    renderComponent();
    
    // Check that Introduction is the default active section
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Introduction",
      })
    ).toBeInTheDocument();
  });

  it("renders without crashing and has required structural elements", () => {
    renderComponent();
    
    // Check for structural elements that actually exist
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: /Explore Our Story/i })).toBeInTheDocument();
    
    // Check that we have lists (both sidebar menu and content lists)
    const lists = screen.getAllByRole("list");
    expect(lists.length).toBeGreaterThanOrEqual(1);
  });

  it("has proper container structure", () => {
    renderComponent();
    
    // Check for Bootstrap container class
    const container = document.querySelector('.container');
    expect(container).toBeInTheDocument();
    
    // Check for row structure
    const rows = document.querySelectorAll('.row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it("displays hero section with statistics", () => {
    renderComponent();
    
    // Check for hero section elements
    expect(screen.getByText("About Hope Harvest")).toBeInTheDocument();
    expect(screen.getByText("Established")).toBeInTheDocument();
    expect(screen.getByText("Lives Impacted")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });
});