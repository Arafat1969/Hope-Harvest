import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../components/HomePage";

describe("HomePage Component", () => {
  it("renders hero section with title", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Hope Harvest")).toBeInTheDocument();
    expect(
      screen.getByText("Sowing Seeds of Change, Reaping a Brighter Future.")
    ).toBeInTheDocument();
  });

  it("displays call-to-action buttons", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Donate Now")).toBeInTheDocument();
    expect(screen.getByText("View Campaigns")).toBeInTheDocument();
  });

  it("shows statistics section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Lives Impacted")).toBeInTheDocument();
    expect(screen.getByText("Active Campaigns")).toBeInTheDocument();
    expect(screen.getByText("Taka Raised")).toBeInTheDocument();
    expect(screen.getByText("Volunteers")).toBeInTheDocument();
  });

  it("displays feature cards", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Self-Reliance Programs")).toBeInTheDocument();
    expect(screen.getByText("Emergency Relief")).toBeInTheDocument();
    expect(screen.getByText("Education & Training")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});