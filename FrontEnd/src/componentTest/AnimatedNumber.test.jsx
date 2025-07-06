import React from "react";
import { render, screen, act } from "@testing-library/react";
import AnimatedNumber from "../components/AnimatedNumber";

describe("AnimatedNumber Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders initial value as 0", () => {
    render(<AnimatedNumber target="1000" />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("animates to target number", () => {
    render(<AnimatedNumber target="1000" />);

    act(() => {
      jest.advanceTimersByTime(2000);
      jest.runAllTimers();
    });

    expect(screen.getByText("1,000")).toBeInTheDocument();
  });

  it("handles numbers with commas", () => {
    render(<AnimatedNumber target="10,000" />);

    act(() => {
      jest.advanceTimersByTime(2000);
      jest.runAllTimers();
    });

    expect(screen.getByText("10,000")).toBeInTheDocument();
  });

  it("preserves suffixes", () => {
    render(<AnimatedNumber target="100+" />);

    act(() => {
      jest.advanceTimersByTime(2000);
      jest.runAllTimers();
    });

    expect(screen.getByText("100+")).toBeInTheDocument();
  });
});