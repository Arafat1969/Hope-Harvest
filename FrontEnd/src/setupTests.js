// src/setupTests.js

import "@testing-library/jest-dom";

// IntersectionObserver stub...
class IntersectionObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe(el) {
    this.cb([{ isIntersecting: true, target: el }]);
  }
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = IntersectionObserver;

// (Optional) fake timers
jest.useFakeTimers();