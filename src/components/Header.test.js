import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useHistory } from 'react-router-dom';

import Header from './Header';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

const push = jest.fn();

useHistory.mockReturnValue({
  push,
});

describe('Render header Component', () => {
  test('Render correctly', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Render Header with login options', () => {
    const { getByText, queryByTestId, getByTestId } = render(<Header />);

    expect(getByTestId('search-bar')).toBeInTheDocument();

    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Sing Up')).toBeInTheDocument();

    expect(queryByTestId('list-menu')).toBeNull();
    expect(queryByTestId('list-menu')).toBeNull();
  });

  test('Render Header with user options', () => {
    // eslint-disable-next-line no-proto
    const storageMock = jest.spyOn(window.localStorage.__proto__, 'getItem');
    storageMock.mockReturnValue('LOGIN_TOKEN');
    const { getByText, queryByTestId, getByTestId } = render(<Header />);

    expect(getByTestId('search-bar')).toBeInTheDocument();

    expect(getByText('My Lists')).toBeInTheDocument();
    expect(getByText('Logout')).toBeInTheDocument();

    expect(queryByTestId('login-menu')).toBeNull();
    expect(queryByTestId('singup-menu')).toBeNull();
    storageMock.mockReset();
  });

  test('Responsive Render', async () => {
    const { queryByTestId } = render(<Header />);
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 200 });
    act(() => {
      fireEvent(window, new Event('resize'));
    });

    expect(queryByTestId('colapse-menu')).toBeInTheDocument();
    expect(queryByTestId('login-menu')).toBeNull();
    expect(queryByTestId('singup-menu')).toBeNull();
    expect(queryByTestId('list-menu')).toBeNull();
    expect(queryByTestId('list-menu')).toBeNull();
    expect(queryByTestId('search-bar')).toBeNull();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    act(() => {
      fireEvent(window, new Event('resize'));
    });
  });

  test('open and close menu on responsive mode', () => {
    const { queryByTestId, getByTestId, getByText } = render(<Header />);
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 200 });
    act(() => {
      fireEvent(window, new Event('resize'));
    });
    const colapseButton = getByTestId('colapse-menu');
    act(() => {
      fireEvent.click(colapseButton);
    });

    expect(getByTestId('search-bar')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Sing Up')).toBeInTheDocument();

    act(() => {
      fireEvent.click(colapseButton);
    });

    expect(queryByTestId('login-menu')).toBeNull();
    expect(queryByTestId('singup-menu')).toBeNull();
    expect(queryByTestId('search-bar')).toBeNull();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    act(() => {
      fireEvent(window, new Event('resize'));
    });
  });
});

describe('Test header features', () => {
  beforeEach(() => {
    push.mockClear();
  });

  test('Brand click', () => {
    const { getByTestId } = render(<Header />);
    const brand = getByTestId('brand');
    act(() => {
      fireEvent.click(brand);
    });
    expect(push).toHaveBeenCalledWith('/');
  });

  test('Login click', () => {
    const { getByTestId } = render(<Header />);
    const brand = getByTestId('login-menu');
    act(() => {
      fireEvent.click(brand);
    });
    expect(push).toHaveBeenCalledWith('/login');
  });

  test('Login click', () => {
    const { getByTestId } = render(<Header />);
    const brand = getByTestId('singup-menu');
    act(() => {
      fireEvent.click(brand);
    });
    expect(push).toHaveBeenCalledWith('/singup');
  });
});

describe('Test header features for user', () => {
  beforeEach(() => {
    push.mockClear();
    // eslint-disable-next-line no-proto
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('LOGIN_TOKEN');
  });

  afterEach(() => {
    // eslint-disable-next-line no-proto
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReset();
  });

  test('list click', () => {
    const { getByTestId } = render(<Header />);
    const brand = getByTestId('list-menu');
    act(() => {
      fireEvent.click(brand);
    });
    expect(push).toHaveBeenCalledWith('/lists');
  });

  test('logout click', () => {
    // eslint-disable-next-line no-proto
    jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementationOnce(jest.fn());
    const { getByTestId } = render(<Header />);
    const brand = getByTestId('logout-menu');
    act(() => {
      fireEvent.click(brand);
    });
    expect(push).toHaveBeenCalledWith('/');
    expect(localStorage.clear).toHaveBeenCalled();
  });
});

describe('search functionality', () => {
  beforeEach(() => {
    push.mockClear();
  });
  test('search redirect to search page with proper query', () => {
    const { getByTestId, getByLabelText } = render(<Header />);
    const searchInput = getByTestId('search-bar');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'mario' } });
    });
    expect(searchInput.value).toBe('mario');

    const submitButton = getByLabelText('search');
    act(() => {
      fireEvent.click(submitButton);
    });
    // debug();
    expect(push).toHaveBeenCalledWith('/search?q=mario');
  });
});
