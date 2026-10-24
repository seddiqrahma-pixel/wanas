import { vi } from 'vitest';

// Mock undici to prevent compatibility issues with jsdom/happy-dom
vi.mock('undici', () => ({
  default: {
    request: vi.fn(),
    pool: vi.fn(),
    agent: vi.fn(),
    pipeline: vi.fn(),
  },
  request: vi.fn(),
  pool: vi.fn(),
  agent: vi.fn(),
  pipeline: vi.fn(),
  Dispatcher: vi.fn(),
  Client: vi.fn(),
  Agent: vi.fn(),
  ProxyAgent: vi.fn(),
  MockAgent: vi.fn(),
  MockPool: vi.fn(),
  MockClient: vi.fn(),
  errors: {
    RequestAbortedError: class extends Error {},
    RequestTimeoutError: class extends Error {},
    ResponseTimeoutError: class extends Error {},
    SocketTimeoutError: class extends Error {},
    InformationalError: class extends Error {},
    SuccessfulError: class extends Error {},
    RedirectionError: class extends Error {},
    ClientError: class extends Error {},
    ServerError: class extends Error {},
    NotFoundError: class extends Error {},
    BodyTimeoutError: class extends Error {},
    HeadersTimeoutError: class extends Error {},
  },
  Header: vi.fn(),
  Headers: vi.fn(),
  Body: vi.fn(),
  FormData: vi.fn(),
  Readable: vi.fn(),
  Writable: vi.fn(),
  Transform: vi.fn(),
  PassThrough: vi.fn(),
  pipeline: vi.fn(),
}));

// Mock fetch globally
const mockFetch = vi.fn();
Object.defineProperty(global, 'fetch', {
  value: mockFetch,
  writable: true,
  configurable: true,
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(global, 'sessionStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(global, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
  configurable: true,
});