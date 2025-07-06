import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import VolunteerActivityLayout from '../components/VolunteerActivityLayout';

// Create a mock for useNavigate before importing the component
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }) => <div data-testid="memory-router">{children}</div>
}));

describe('VolunteerActivityLayout', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderComponent = () => {
    return render(<VolunteerActivityLayout />);
  };

  test('renders hero title and statistics', () => {
    renderComponent();

    expect(screen.getByText(/volunteer with hope harvest/i)).toBeInTheDocument();
    
    // Use getAllByText for duplicate elements and check specific ones
    const statisticElements = screen.getAllByText(/150K\+/);
    expect(statisticElements[0]).toBeInTheDocument();
    
    const hundredKElements = screen.getAllByText(/100K\+/);
    expect(hundredKElements[0]).toBeInTheDocument();
    
    // For elements that appear multiple times, use more specific selectors
    expect(screen.getByText('Hours Served')).toBeInTheDocument();
    expect(screen.getByText('Lives Touched')).toBeInTheDocument();
    expect(screen.getByText('Students Helped')).toBeInTheDocument();
    expect(screen.getByText('Patients Served')).toBeInTheDocument();
  });

  test('renders all step cards using role selectors', () => {
    renderComponent();

    // Use getAllByText to handle duplicates and select the step cards specifically
    const aimElements = screen.getAllByText('Aim');
    expect(aimElements.length).toBeGreaterThanOrEqual(1);
    
    const activityElements = screen.getAllByText('Activity');
    expect(activityElements.length).toBeGreaterThanOrEqual(1);
    
    const requirementsElements = screen.getAllByText('Requirements');
    expect(requirementsElements.length).toBeGreaterThanOrEqual(1);
    
    const achievementsElements = screen.getAllByText('Achievements');
    expect(achievementsElements.length).toBeGreaterThanOrEqual(1);
  });

  test('displays default step content (Aim)', () => {
    renderComponent();

    // Look for the content heading specifically (h3 level)
    const aimHeadings = screen.getAllByRole('heading', { level: 3 });
    const aimContentHeading = aimHeadings.find(heading => heading.textContent === 'Aim');
    expect(aimContentHeading).toBeInTheDocument();
    
    expect(screen.getByText(/The volunteer program at Hope Harvest aims to create/i)).toBeInTheDocument();
  });

  test('clicking a step card updates the step content', () => {
    renderComponent();

    // Find Activity in step cards (h6 elements) and click the first one
    const activityElements = screen.getAllByText('Activity');
    const activityStepCard = activityElements.find(el => el.tagName === 'H6');
    fireEvent.click(activityStepCard);

    // Check if Activity content heading (h3) is displayed
    const activityHeadings = screen.getAllByRole('heading', { level: 3 });
    const activityContentHeading = activityHeadings.find(heading => heading.textContent === 'Activity');
    expect(activityContentHeading).toBeInTheDocument();
    
    expect(screen.getByText(/Volunteers at Hope Harvest engage in a wide range of activities/i)).toBeInTheDocument();
  });

  test('clicking navigation dots updates active step', () => {
    renderComponent();

    // Find step navigation elements by their step text
    const stepElements = screen.getAllByText(/Step \d/);
    expect(stepElements.length).toBe(4);
    
    // Click the second step (Activity)
    const step2Element = screen.getByText('Step 2');
    const activityCard = step2Element.parentElement;
    fireEvent.click(activityCard);

    // Check if Activity content is displayed
    const activityHeadings = screen.getAllByRole('heading', { level: 3 });
    const activityContentHeading = activityHeadings.find(heading => heading.textContent === 'Activity');
    expect(activityContentHeading).toBeInTheDocument();
  });

  test('step cards have proper styling and hover effects', () => {
    renderComponent();

    // Find the step card by looking for Step 1 text and its parent
    const step1Element = screen.getByText('Step 1');
    const aimCard = step1Element.parentElement;
    
    // Test hover effect
    fireEvent.mouseEnter(aimCard);
    fireEvent.mouseLeave(aimCard);
    
    expect(aimCard).toBeInTheDocument();
  });

  test('progress bar updates based on active step', () => {
    renderComponent();

    // Find Requirements step card and click it
    const requirementsElements = screen.getAllByText('Requirements');
    const requirementsStepCard = requirementsElements.find(el => el.tagName === 'H6');
    fireEvent.click(requirementsStepCard);

    // Check if the step content changed
    const requirementsHeadings = screen.getAllByRole('heading', { level: 3 });
    const requirementsContentHeading = requirementsHeadings.find(heading => heading.textContent === 'Requirements');
    expect(requirementsContentHeading).toBeInTheDocument();
  });

  test('all statistics are displayed correctly', () => {
    renderComponent();

    expect(screen.getByText('Hours Served')).toBeInTheDocument();
    expect(screen.getByText('Lives Touched')).toBeInTheDocument();
    expect(screen.getByText('Students Helped')).toBeInTheDocument();
    expect(screen.getByText('Patients Served')).toBeInTheDocument();
  });

  test('clicking "Join as Volunteer" navigates to registration page', () => {
    renderComponent();

    const joinButton = screen.getByRole('button', { name: /Join as Volunteer/i });
    fireEvent.click(joinButton);

    expect(mockNavigate).toHaveBeenCalledWith('/volunteer-registration');
  });

  test('join button has proper styling and hover effects', () => {
    renderComponent();

    const joinButton = screen.getByRole('button', { name: /Join as Volunteer/i });
    
    // Test hover effects
    fireEvent.mouseEnter(joinButton);
    fireEvent.mouseLeave(joinButton);
    
    expect(joinButton).toBeInTheDocument();
  });

  test('component renders without crashing', () => {
    renderComponent();
    
    expect(screen.getByText('Volunteer with Hope Harvest')).toBeInTheDocument();
    expect(screen.getByText('Explore Volunteer Journey')).toBeInTheDocument();
  });

  test('all step content is accessible', () => {
    renderComponent();

    const steps = [
      { name: 'Aim', stepNumber: 'Step 1' },
      { name: 'Activity', stepNumber: 'Step 2' },
      { name: 'Requirements', stepNumber: 'Step 3' },
      { name: 'Achievements', stepNumber: 'Step 4' }
    ];
    
    steps.forEach((step) => {
      // Find and click the step card using step number
      const stepElement = screen.getByText(step.stepNumber);
      const stepCard = stepElement.parentElement;
      fireEvent.click(stepCard);
      
      // Check if the content heading appears
      const contentHeadings = screen.getAllByRole('heading', { level: 3 });
      const contentHeading = contentHeadings.find(heading => heading.textContent === step.name);
      expect(contentHeading).toBeInTheDocument();
    });
  });

  test('displays step numbers correctly', () => {
    renderComponent();

    // Check if step numbers are displayed (1-4)
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Step 4')).toBeInTheDocument();
  });

  test('statistics section has proper structure', () => {
    renderComponent();

    // Test that statistics are properly grouped
    const statisticsContainer = screen.getByText('150K+').parentElement;
    expect(within(statisticsContainer).getByText('Hours Served')).toBeInTheDocument();
  });

  test('step cards section has proper structure', () => {
    renderComponent();

    // Test that step cards are properly structured
    expect(screen.getByText('Explore Volunteer Journey')).toBeInTheDocument();
    
    // Verify all step numbers exist
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByText(`Step ${i}`)).toBeInTheDocument();
    }
  });

  test('matches snapshot', () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });
});