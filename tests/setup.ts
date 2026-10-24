import { vi, beforeEach } from 'vitest';

// ============================================
// Complete undici mock - must be first before any undici imports
// ============================================

// Mock the decompress interceptor that causes "Cannot read properties of undefined (reading 'bind')"
const mockDecompressInterceptor = vi.fn(() => ({
  name: 'decompress',
  handler: vi.fn(),
}));

// Mock all undici interceptors
const mockInterceptors = {
  redirect: vi.fn(() => ({ name: 'redirect', handler: vi.fn() })),
  responseError: vi.fn(() => ({ name: 'responseError', handler: vi.fn() })),
  retry: vi.fn(() => ({ name: 'retry', handler: vi.fn() })),
  dump: vi.fn(() => ({ name: 'dump', handler: vi.fn() })),
  dns: vi.fn(() => ({ name: 'dns', handler: vi.fn() })),
  cache: vi.fn(() => ({ name: 'cache', handler: vi.fn() })),
  decompress: mockDecompressInterceptor,
  deduplicate: vi.fn(() => ({ name: 'deduplicate', handler: vi.fn() })),
};

// Mock undici classes and functions
const mockUndici = {
  // Core classes
  Agent: vi.fn().mockImplementation(() => ({
    dispatch: vi.fn(),
    close: vi.fn(),
    destroy: vi.fn(),
  })),
  BalancedPool: vi.fn().mockImplementation(() => ({
    dispatch: vi.fn(),
    close: vi.fn(),
  })),
  Client: vi.fn().mockImplementation(() => ({
    request: vi.fn(),
    close: vi.fn(),
    destroy: vi.fn(),
  })),
  Pool: vi.fn().mockImplementation(() => ({
    dispatch: vi.fn(),
    close: vi.fn(),
  })),
  RoundRobinPool: vi.fn().mockImplementation(() => ({
    dispatch: vi.fn(),
    close: vi.fn(),
  })),
  ProxyAgent: vi.fn(),
  EnvHttpProxyAgent: vi.fn(),
  Socks5ProxyAgent: vi.fn(),
  RetryAgent: vi.fn(),
  H2CClient: vi.fn(),
  Dispatcher: vi.fn(),
  Dispatcher1Wrapper: vi.fn(),
  MockAgent: vi.fn(),
  MockClient: vi.fn(),
  MockPool: vi.fn(),
  SnapshotAgent: vi.fn(),
  RetryHandler: vi.fn(),
  DecoratorHandler: vi.fn(),
  RedirectHandler: vi.fn(),
  buildConnector: vi.fn(),

  // Web standards
  Headers: vi.fn().mockImplementation(() => ({
    append: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    has: vi.fn(),
    set: vi.fn(),
    forEach: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    [Symbol.iterator]: vi.fn(),
  })),
  Request: vi.fn().mockImplementation(() => ({
    headers: new Headers(),
    method: 'GET',
    url: '',
    body: null,
  })),
  Response: vi.fn().mockImplementation(() => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: vi.fn().mockResolvedValue({}),
    text: vi.fn().mockResolvedValue(''),
    blob: vi.fn().mockResolvedValue(new Blob()),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    clone: vi.fn(),
  })),
  FormData: vi.fn().mockImplementation(() => ({
    append: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    has: vi.fn(),
    set: vi.fn(),
    forEach: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    [Symbol.iterator]: vi.fn(),
  })),
  FetchError: class FetchError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FetchError';
    }
  },
  RequestError: class RequestError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'RequestError';
    }
  },
  ResponseError: class ResponseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ResponseError';
    }
  },
  AbortError: class AbortError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AbortError';
    }
  },

  // Interceptors
  interceptors: mockInterceptors,

  // Utility functions
  fetch: vi.fn(),
  connect: vi.fn(),
  request: vi.fn(),
  stream: vi.fn(),
  pipeline: vi.fn(),
  upgrade: vi.fn(),
  ping: vi.fn(),

  // Cookie functions
  setCookie: vi.fn(),
  getCookies: vi.fn(),
  getSetCookies: vi.fn(),
  deleteCookie: vi.fn(),
  parseCookie: vi.fn(),

  // Origin functions
  setGlobalOrigin: vi.fn(),
  getGlobalOrigin: vi.fn(),

  // Dispatcher functions
  setGlobalDispatcher: vi.fn(),
  getGlobalDispatcher: vi.fn(),

  // Cache
  caches: {},
  cacheStores: {
    MemoryCacheStore: vi.fn(),
    SqliteCacheStore: vi.fn(),
  },

  // WebSocket
  WebSocket: vi.fn().mockImplementation(() => ({
    close: vi.fn(),
    send: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
  EventSource: vi.fn(),
  CloseEvent: vi.fn(),
  ErrorEvent: vi.fn(),
  MessageEvent: vi.fn(),

  // MIME
  parseMIMEType: vi.fn(),
  serializeAMimeType: vi.fn(),

  // Errors
  errors: {
    AbortError: class AbortError extends Error { constructor(m: string) { super(m); this.name = 'AbortError'; } },
    UndiciError: class UndiciError extends Error { constructor(m: string) { super(m); this.name = 'UndiciError'; } },
    HeadersTimeoutError: class HeadersTimeoutError extends Error { constructor(m: string) { super(m); this.name = 'HeadersTimeoutError'; } },
    HeadersOverflowError: class HeadersOverflowError extends Error { constructor(m: string) { super(m); this.name = 'HeadersOverflowError'; } },
    BodyTimeoutError: class BodyTimeoutError extends Error { constructor(m: string) { super(m); this.name = 'BodyTimeoutError'; } },
    RequestContentLengthMismatchError: class RequestContentLengthMismatchError extends Error { constructor(m: string) { super(m); this.name = 'RequestContentLengthMismatchError'; } },
    ConnectTimeoutError: class ConnectTimeoutError extends Error { constructor(m: string) { super(m); this.name = 'ConnectTimeoutError'; } },
    InvalidArgumentError: class InvalidArgumentError extends Error { constructor(m: string) { super(m); this.name = 'InvalidArgumentError'; } },
    InvalidReturnValueError: class InvalidReturnValueError extends Error { constructor(m: string) { super(m); this.name = 'InvalidReturnValueError'; } },
    RequestAbortedError: class RequestAbortedError extends Error { constructor(m: string) { super(m); this.name = 'RequestAbortedError'; } },
    ClientDestroyedError: class ClientDestroyedError extends Error { constructor(m: string) { super(m); this.name = 'ClientDestroyedError'; } },
    ClientClosedError: class ClientClosedError extends Error { constructor(m: string) { super(m); this.name = 'ClientClosedError'; } },
    InformationalError: class InformationalError extends Error { constructor(m: string) { super(m); this.name = 'InformationalError'; } },
    SocketError: class SocketError extends Error { constructor(m: string) { super(m); this.name = 'SocketError'; } },
    NotSupportedError: class NotSupportedError extends Error { constructor(m: string) { super(m); this.name = 'NotSupportedError'; } },
    ResponseContentLengthMismatchError: class ResponseContentLengthMismatchError extends Error { constructor(m: string) { super(m); this.name = 'ResponseContentLengthMismatchError'; } },
    BalancedPoolMissingUpstreamError: class BalancedPoolMissingUpstreamError extends Error { constructor(m: string) { super(m); this.name = 'BalancedPoolMissingUpstreamError'; } },
    ResponseExceededMaxSizeError: class ResponseExceededMaxSizeError extends Error { constructor(m: string) { super(m); this.name = 'ResponseExceededMaxSizeError'; } },
    RequestRetryError: class RequestRetryError extends Error { constructor(m: string) { super(m); this.name = 'RequestRetryError'; } },
    ResponseError: class ResponseError extends Error { constructor(m: string) { super(m); this.name = 'ResponseError'; } },
    SecureProxyConnectionError: class SecureProxyConnectionError extends Error { constructor(m: string) { super(m); this.name = 'SecureProxyConnectionError'; } },
    ProxyConnectionError: class ProxyConnectionError extends Error { constructor(m: string) { super(m); this.name = 'ProxyConnectionError'; } },
    MaxOriginsReachedError: class MaxOriginsReachedError extends Error { constructor(m: string) { super(m); this.name = 'MaxOriginsReachedError'; } },
    MaxRedirectsError: class MaxRedirectsError extends Error { constructor(m: string) { super(m); this.name = 'MaxRedirectsError'; } },
    Socks5ProxyError: class Socks5ProxyError extends Error { constructor(m: string) { super(m); this.name = 'Socks5ProxyError'; } },
    MessageSizeExceededError: class MessageSizeExceededError extends Error { constructor(m: string) { super(m); this.name = 'MessageSizeExceededError'; } },
  },

  // Mock errors
  mockErrors: {
    MockNotMatchedError: class MockNotMatchedError extends Error { constructor(m: string) { super(m); this.name = 'MockNotMatchedError'; } },
  },

  // Utility
  util: {
    parseHeaders: vi.fn(),
    headerNameToString: vi.fn(),
  },

  // Install function
  install: vi.fn(),
};

// Mock undici module
vi.mock('undici', () => mockUndici);

// Also mock undici submodules that might be imported directly
vi.mock('undici/lib/interceptor/decompress', () => ({
  createDecompressInterceptor: mockDecompressInterceptor,
}));

vi.mock('undici/lib/interceptor/redirect', () => ({
  createRedirectInterceptor: vi.fn(),
}));

vi.mock('undici/lib/interceptor/retry', () => ({
  createRetryInterceptor: vi.fn(),
}));

vi.mock('undici/lib/interceptor/dns', () => ({
  createDnsInterceptor: vi.fn(),
}));

vi.mock('undici/lib/interceptor/cache', () => ({
  createCacheInterceptor: vi.fn(),
}));

vi.mock('undici/lib/interceptor/deduplicate', () => ({
  createDeduplicateInterceptor: vi.fn(),
}));

vi.mock('undici/lib/interceptor/response-error', () => ({
  createResponseErrorInterceptor: vi.fn(),
}));

vi.mock('undici/lib/interceptor/dump', () => ({
  createDumpInterceptor: vi.fn(),
}));

// ============================================
// Global fetch, Request, Response, Headers, FormData mocks
// ============================================

// Mock fetch globally
const mockFetch = vi.fn();
Object.defineProperty(global, 'fetch', {
  value: mockFetch,
  writable: true,
  configurable: true,
});

// Mock Request globally
const MockRequest = vi.fn().mockImplementation((input: string | Request, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.url;
  return {
    url,
    method: init?.method || 'GET',
    headers: new Headers(init?.headers),
    body: init?.body || null,
    credentials: init?.credentials || 'same-origin',
    cache: init?.cache || 'default',
    redirect: init?.redirect || 'follow',
    referrer: init?.referrer || '',
    referrerPolicy: init?.referrerPolicy || '',
    integrity: init?.integrity || '',
    keepalive: init?.keepalive || false,
    signal: init?.signal || null,
    clone: vi.fn(),
  };
});
Object.defineProperty(global, 'Request', {
  value: MockRequest,
  writable: true,
  configurable: true,
});

// Mock Response globally
const MockResponse = vi.fn().mockImplementation((body?: BodyInit | null, init?: ResponseInit) => {
  const headers = new Headers(init?.headers);
  const response = {
    ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
    status: init?.status || 200,
    statusText: init?.statusText || 'OK',
    headers,
    body,
    bodyUsed: false,
    type: 'default',
    url: '',
    redirected: false,
    clone: vi.fn().mockImplementation(function(this: any) {
      return new MockResponse(this.body, { status: this.status, statusText: this.statusText, headers: this.headers });
    }),
    json: vi.fn().mockResolvedValue(typeof body === 'string' ? JSON.parse(body) : {}),
    text: vi.fn().mockResolvedValue(typeof body === 'string' ? body : ''),
    blob: vi.fn().mockResolvedValue(new Blob([body as BlobPart])),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    formData: vi.fn().mockResolvedValue(new FormData()),
  };
  return response;
});
// Add static methods
MockResponse.error = vi.fn().mockImplementation(() => new MockResponse(null, { status: 500, statusText: 'Internal Server Error' }));
MockResponse.redirect = vi.fn().mockImplementation((url: string, status: number) => new MockResponse(null, { status, headers: { location: url } }));
Object.defineProperty(global, 'Response', {
  value: MockResponse,
  writable: true,
  configurable: true,
});

// Mock Headers globally
const MockHeaders = vi.fn().mockImplementation((init?: HeadersInit) => {
  const map = new Map<string, string[]>();
  if (init) {
    if (init instanceof Headers) {
      init.forEach((value, key) => map.set(key.toLowerCase(), [value]));
    } else if (Array.isArray(init)) {
      init.forEach(([key, value]) => map.set(key.toLowerCase(), [value]));
    } else if (typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => map.set(key.toLowerCase(), [String(value)]));
    }
  }
  return {
    append: vi.fn((key: string, value: string) => {
      const existing = map.get(key.toLowerCase()) || [];
      existing.push(value);
      map.set(key.toLowerCase(), existing);
    }),
    delete: vi.fn((key: string) => map.delete(key.toLowerCase())),
    get: vi.fn((key: string) => map.get(key.toLowerCase())?.[0] || null),
    has: vi.fn((key: string) => map.has(key.toLowerCase())),
    set: vi.fn((key: string, value: string) => map.set(key.toLowerCase(), [value])),
    forEach: vi.fn((callback: (value: string, key: string, parent: Headers) => void) => {
      map.forEach((values, key) => callback(values[0], key, map as any));
    }),
    keys: vi.fn(function* () { for (const key of map.keys()) yield key; }),
    values: vi.fn(function* () { for (const values of map.values()) yield values[0]; }),
    entries: vi.fn(function* () { for (const [key, values] of map.entries()) yield [key, values[0]]; }),
    [Symbol.iterator]: vi.fn(function* () { for (const [key, values] of map.entries()) yield [key, values[0]]; }),
  };
});
Object.defineProperty(global, 'Headers', {
  value: MockHeaders,
  writable: true,
  configurable: true,
});

// Mock FormData globally
const MockFormData = vi.fn().mockImplementation(() => {
  const map = new Map<string, FormDataEntryValue[]>();
  return {
    append: vi.fn((name: string, value: FormDataEntryValue) => {
      const existing = map.get(name) || [];
      existing.push(value);
      map.set(name, existing);
    }),
    delete: vi.fn((name: string) => map.delete(name)),
    get: vi.fn((name: string) => map.get(name)?.[0] || null),
    getAll: vi.fn((name: string) => map.get(name) || []),
    has: vi.fn((name: string) => map.has(name)),
    set: vi.fn((name: string, value: FormDataEntryValue) => map.set(name, [value])),
    forEach: vi.fn((callback: (value: FormDataEntryValue, key: string, parent: FormData) => void) => {
      map.forEach((values, key) => values.forEach(v => callback(v, key, map as any)));
    }),
    keys: vi.fn(function* () { for (const key of map.keys()) yield key; }),
    values: vi.fn(function* () { for (const values of map.values()) for (const v of values) yield v; }),
    entries: vi.fn(function* () { for (const [key, values] of map.entries()) for (const v of values) yield [key, v]; }),
    [Symbol.iterator]: vi.fn(function* () { for (const [key, values] of map.entries()) for (const v of values) yield [key, v]; }),
  };
});
Object.defineProperty(global, 'FormData', {
  value: MockFormData,
  writable: true,
  configurable: true,
});

// ============================================
// Storage mocks
// ============================================

const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

Object.defineProperty(global, 'localStorage', {
  value: createStorageMock(),
  writable: true,
  configurable: true,
});

Object.defineProperty(global, 'sessionStorage', {
  value: createStorageMock(),
  writable: true,
  configurable: true,
});

// ============================================
// Browser API mocks
// ============================================

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
  takeRecords: vi.fn(() => []),
  thresholds: [],
  root: null,
  rootMargin: '',
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

// Mock scrollTo
global.scrollTo = vi.fn();
global.scrollBy = vi.fn();
global.scrollIntoView = vi.fn();

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// Mock performance.now
if (!global.performance) {
  global.performance = { now: vi.fn(() => Date.now()) } as unknown as Performance;
} else {
  global.performance.now = vi.fn(() => Date.now());
}

// Mock crypto.randomUUID
if (!global.crypto) {
  global.crypto = { randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).slice(2)) } as unknown as Crypto;
} else {
  global.crypto.randomUUID = vi.fn(() => 'mock-uuid-' + Math.random().toString(36).slice(2));
}

// Mock console.error to reduce noise in tests (optional, can be removed if needed)
const originalConsoleError = console.error;
console.error = vi.fn((...args) => {
  // Only suppress specific known noise, not all errors
  const msg = args.join(' ');
  if (msg.includes('Warning:') || msg.includes('act(...)')) {
    return;
  }
  originalConsoleError.apply(console, args);
});

// ============================================
// Cleanup between tests
// ============================================

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockReset();
  MockRequest.mockClear();
  MockResponse.mockClear();
  MockHeaders.mockClear();
  MockFormData.mockClear();
});