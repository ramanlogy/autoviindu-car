# Cross-Browser Cache System

A comprehensive caching solution that provides consistent cache behavior across different browsers with automatic fallbacks and optimizations.

## Features

- ✅ **Browser Compatibility Detection** - Automatically detects browser capabilities and adapts accordingly
- ✅ **Cross-Tab Synchronization** - Real-time cache synchronization across browser tabs/windows
- ✅ **Browser-Specific Optimizations** - Performance optimizations tailored to each browser
- ✅ **Fallback Mechanisms** - Graceful degradation for browsers with limited capabilities
- ✅ **Cache Consistency Checks** - Automatic validation and repair of cache data
- ✅ **Comprehensive Testing** - Built-in test suite for validation and debugging

## Quick Start

### Basic Usage

```typescript
import { cache } from '@/lib/cross-browser-cache';

// Set cache data
await cache.set('user-profile', { name: 'John', age: 30 });

// Get cache data
const profile = await cache.get('user-profile');
console.log(profile); // { name: 'John', age: 30 }

// Check if key exists
const exists = await cache.has('user-profile');
console.log(exists); // true

// Delete cache entry
await cache.delete('user-profile');
```

### Cached API Calls

```typescript
import { cachedApiCall } from '@/lib/cross-browser-cache';

const userData = await cachedApiCall(
  'user-data',
  () => fetch('/api/user').then(r => r.json()),
  {
    ttl: 300000, // 5 minutes
    persistent: true,
    syncAcrossTabs: true,
  }
);
```

### Advanced Setup

```typescript
import { setupCache } from '@/lib/cross-browser-cache';

const cacheSystem = setupCache({
  enableCrossTabSync: true,
  enableOptimizations: true,
  enableConsistencyChecks: true,
  enableFallbacks: true,
  logCompatibilityInfo: true,
});

console.log(cacheSystem.cache.getInfo());
```

## API Reference

### Cache Operations

#### `cache.set(key, data, options?)`
Set data in cache with optional configuration.

```typescript
await cache.set('my-key', 'my-value', {
  ttl: 300000,           // Time to live (5 minutes)
  persistent: true,      // Store in localStorage
  syncAcrossTabs: true,  // Broadcast to other tabs
  version: '1.0.0',      // Cache version
  metadata: { source: 'api' }
});
```

#### `cache.get(key, options?)`
Get data from cache.

```typescript
const data = await cache.get('my-key', {
  fallbackValue: 'default'
});
```

#### `cache.has(key, options?)`
Check if key exists in cache.

#### `cache.delete(key, options?)`
Delete cache entry.

#### `cache.clear()`
Clear all cache data.

#### `cache.batch(operations)`
Perform multiple cache operations efficiently.

```typescript
const results = await cache.batch({
  sets: [
    { key: 'key1', data: 'value1' },
    { key: 'key2', data: 'value2' }
  ],
  gets: [{ key: 'key1' }],
  deletes: [{ key: 'key2' }]
});
```

### Browser Compatibility

#### `browser.capabilities()`
Get browser capabilities information.

```typescript
const caps = browser.capabilities();
console.log(caps.name);        // 'chrome'
console.log(caps.version);     // '120.0.0.0'
console.log(caps.localStorage); // true
```

#### `browser.supportLevel()`
Get browser support level assessment.

```typescript
const support = browser.supportLevel();
console.log(support.level);        // 'full' | 'partial' | 'limited' | 'none'
console.log(support.features);     // ['localStorage', 'indexedDB', ...]
console.log(support.limitations);  // ['serviceWorker not available']
```

#### `browser.isSupported(feature)`
Check if a specific feature is supported.

```typescript
if (browser.isSupported('localStorage')) {
  // Use localStorage
}
```

### Cross-Tab Synchronization

#### Broadcasting Changes

```typescript
// Broadcast cache updates to other tabs
sync.broadcastCacheUpdate('user-preferences', { theme: 'dark' });

// Broadcast deletions
sync.broadcastCacheDelete('temp-data');

// Broadcast clear all
sync.broadcastCacheClear();
```

#### Listening for Changes

```typescript
// Listen for cache updates from other tabs
const unsubscribe = sync.onCacheUpdate((key, data, source, timestamp) => {
  console.log(`Cache updated: ${key}`, data);
});

// Listen for deletions
sync.onCacheDelete((key, source, timestamp) => {
  console.log(`Cache deleted: ${key}`);
});

// Clean up
unsubscribe();
```

### Cache Optimization

#### Getting Optimization Config

```typescript
const config = optimize.getOptimizedConfig();
console.log(config.storage);    // Storage strategy
console.log(config.sync);       // Sync strategy
console.log(config.performance); // Performance settings
```

#### Performance Monitoring

```typescript
const metrics = optimize.getMetrics();
console.log(metrics.memoryUsage);      // Memory usage in bytes
console.log(metrics.cacheHitRate);     // Hit rate percentage
console.log(metrics.averageResponseTime); // Average response time
```

### Fallback Mechanisms

#### Getting Available Storage

```typescript
const backends = fallback.getAvailableBackends();
console.log(backends); // ['localStorage', 'indexedDB', 'memory']

const storage = fallback.getStorage('localStorage');
if (storage) {
  await storage.set('key', 'value');
  const data = await storage.get('key');
}
```

#### Fallback Information

```typescript
const info = fallback.getFallbackInfo();
console.log(info.currentBackend);    // Current storage backend
console.log(info.availableBackends); // All available backends
console.log(info.limitations);       // Browser limitations
```

### Consistency Management

#### Health Status

```typescript
const status = consistency.getConsistencyStatus();
console.log(status.healthScore);        // 0-100 health score
console.log(status.issuesBySeverity);   // Issues grouped by severity
console.log(status.totalChecks);        // Number of consistency checks
```

#### Manual Repair

```typescript
const result = await consistency.triggerManualRepair();
console.log(result.success);     // Repair successful
console.log(result.issuesFixed); // Number of issues fixed
console.log(result.errors);      // Any errors encountered
```

### Testing

#### Running Tests

```typescript
// Run specific test suite
const results = await test.runTestSuite('unified-cache');
console.log(results);

// Run all tests
const allResults = await test.runAllTests();

// Get test summary
const summary = test.getTestSummary();
console.log(`Passed: ${summary.passedTests}/${summary.totalTests}`);

// Generate test report
const report = test.generateTestReport();
console.log(report);
```

## Configuration Options

### Cache Options

```typescript
interface CacheOptions {
  ttl?: number;              // Time to live in milliseconds
  persistent?: boolean;      // Store in localStorage
  compressed?: boolean;      // Enable compression
  version?: string;          // Cache version
  metadata?: Record<string, any>; // Additional metadata
  syncAcrossTabs?: boolean;  // Broadcast to other tabs
  fallbackValue?: any;       // Default value if not found
}
```

### Setup Options

```typescript
interface SetupOptions {
  enableCrossTabSync?: boolean;     // Enable cross-tab sync
  enableOptimizations?: boolean;    // Enable optimizations
  enableConsistencyChecks?: boolean; // Enable consistency checks
  enableFallbacks?: boolean;        // Enable fallback mechanisms
  logCompatibilityInfo?: boolean;   // Log browser info in dev
}
```

## Browser Support

### Fully Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partially Supported Browsers
- Chrome 60-89
- Firefox 60-87
- Safari 12-13
- Edge 79-89

### Limited Support Browsers
- Internet Explorer 11
- Older mobile browsers
- Browsers with restricted storage

## Best Practices

### 1. Use Appropriate TTL Values
```typescript
// User data - short TTL
await cache.set('user-profile', data, { ttl: 300000 }); // 5 minutes

// Static data - longer TTL
await cache.set('countries', data, { ttl: 86400000 }); // 24 hours

// Session data - no persistence
await cache.set('temp-data', data, { ttl: 3600000 }); // 1 hour
```

### 2. Enable Cross-Tab Sync for Shared Data
```typescript
// User preferences should sync across tabs
await cache.set('user-preferences', prefs, {
  syncAcrossTabs: true,
  persistent: true
});
```

### 3. Use Persistent Storage for Important Data
```typescript
// Store user authentication state persistently
await cache.set('auth-token', token, {
  persistent: true,
  ttl: 86400000 // 24 hours
});
```

### 4. Handle Cache Misses Gracefully
```typescript
const userData = await cache.get('user-data', {
  fallbackValue: { name: 'Guest', loggedIn: false }
});

if (!userData.loggedIn) {
  // Handle guest user
}
```

### 5. Monitor Cache Performance
```typescript
// Check cache statistics
const stats = cache.getStats();
console.log(`Hit Rate: ${stats.hitRate * 100}%`);

// Check health status
const health = await healthCheck();
if (!health.healthy) {
  console.warn('Cache health issues:', health.issues);
}
```

## Troubleshooting

### Common Issues

#### 1. Cache Not Working in Private Mode
Some browsers restrict storage in private/incognito mode. The system automatically falls back to memory storage.

#### 2. Cross-Tab Sync Not Working
Check if the browser supports the required APIs:
```typescript
const syncStatus = sync.getSyncStatus();
console.log(syncStatus.method); // Should be 'broadcast-channel' or 'storage-events'
```

#### 3. Performance Issues
Enable optimization and monitor metrics:
```typescript
const metrics = optimize.getMetrics();
console.log('Memory Usage:', metrics.memoryUsage);
console.log('Response Time:', metrics.averageResponseTime);
```

#### 4. Storage Quota Exceeded
The system automatically handles storage pressure:
```typescript
// Monitor storage usage
const info = cache.getInfo();
console.log('Storage Usage:', info.storageUsage);
```

### Debug Mode

Enable debug logging in development:
```typescript
// The system automatically logs detailed information in development mode
// Check browser console for:
// - Browser compatibility report
// - Cache optimization recommendations
// - Test results
// - Consistency status
```

## Examples

### Complete Example: User Session Management

```typescript
import { cache, setupCache, cachedApiCall } from '@/lib/cross-browser-cache';

// Initialize cache system
setupCache({
  enableCrossTabSync: true,
  enableOptimizations: true,
  enableConsistencyChecks: true,
});

// Login user
async function loginUser(credentials) {
  try {
    const userData = await cachedApiCall(
      'user-login',
      () => fetch('/api/v1/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()),
      {
        ttl: 86400000, // 24 hours
        persistent: true,
        syncAcrossTabs: true,
      }
    );

    // Store additional session data
    await cache.set('user-session', {
      userId: userData.id,
      loginTime: Date.now(),
      preferences: userData.preferences
    }, {
      persistent: true,
      syncAcrossTabs: true,
    });

    return userData;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Get current user
async function getCurrentUser() {
  const session = await cache.get('user-session');
  if (!session) return null;

  // Refresh user data if needed
  try {
    const freshData = await cachedApiCall(
      'user-data',
      () => fetch(`/api/user/${session.userId}`).then(r => r.json()),
      { ttl: 300000 } // 5 minutes
    );

    return freshData;
  } catch (error) {
    // Return cached session data as fallback
    return session;
  }
}

// Logout user
async function logoutUser() {
  await cache.clear();
  // Redirect to login page
}
```

## Contributing

The cross-browser cache system is designed to be extensible. Key extension points:

1. **Custom Storage Backends** - Add new storage mechanisms in `cache-fallbacks.ts`
2. **Browser-Specific Optimizations** - Add optimizations in `cache-optimizations.ts`
3. **Consistency Checks** - Add new checks in `cache-consistency.ts`
4. **Test Cases** - Add tests in `cache-tests.ts`

## License

This cache system is part of the AutoViindu project and follows the same licensing terms.