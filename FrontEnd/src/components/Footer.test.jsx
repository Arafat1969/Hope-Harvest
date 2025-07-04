import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer.jsx";

describe("Footer Component", () => {
  it("renders current year in copyright", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Hope Harvest. All Rights Reserved.`)
    ).toBeInTheDocument();
  });

  it("contains working links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
