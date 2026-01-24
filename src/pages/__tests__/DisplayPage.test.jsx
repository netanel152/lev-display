import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import DisplayPage from '../DisplayPage';
import { BrowserRouter } from 'react-router-dom';
import * as hebrewDateUtils from '../../utils/hebrewDate';

// Mock dependencies
vi.mock('../../utils/storage', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    safeJSONParse: vi.fn(),
  };
});

// Mock Lucide icons to avoid rendering issues (optional but good for snapshots)
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  // Return a proxy that just renders the name of the icon
  return new Proxy(actual, {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return (props) => <div data-testid={`icon-${String(prop)}`} {...props} />;
    },
  });
});

describe('DisplayPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset mocks
    vi.clearAllMocks();
    
    // Default mocks
    vi.spyOn(hebrewDateUtils, 'getTodayHebrewDate').mockReturnValue(`א' בתשרי תשפ"ד`);
    vi.spyOn(hebrewDateUtils, 'getCurrentHoliday').mockReturnValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with default data', async () => {
    // Mock storage to return empty/null so it falls back to MOCK_DATA or handled gracefully
    // We need to import the mocked module to configure the return value
    const { safeJSONParse } = await import('../../utils/storage');
    const mockItems = [
      {
        id: '1',
        type: 'memorial',
        mainName: 'ישראל ישראלי',
        subText: 'לעילוי נשמת',
        footerText: 'הונצח על ידי משפחתו',
        title: 'ז"ל'
      }
    ];
    safeJSONParse.mockReturnValue(mockItems);

    render(
      <BrowserRouter>
        <DisplayPage />
      </BrowserRouter>
    );

    expect(screen.getByText('ישראל ישראלי')).toBeInTheDocument();
    expect(screen.getByText('לעילוי נשמת')).toBeInTheDocument();
    expect(screen.getByText('לב חב"ד')).toBeInTheDocument();
  });

  it('displays holiday slide when it is a holiday', async () => {
    const { safeJSONParse } = await import('../../utils/storage');
    safeJSONParse.mockReturnValue([]); // No regular items

    // Mock holiday
    vi.spyOn(hebrewDateUtils, 'getCurrentHoliday').mockReturnValue('ראש השנה');

    render(
      <BrowserRouter>
        <DisplayPage />
      </BrowserRouter>
    );

    expect(screen.getByText('ראש השנה')).toBeInTheDocument();
    expect(screen.getByText('חג שמח!')).toBeInTheDocument();
  });
});
