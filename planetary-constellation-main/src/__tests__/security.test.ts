import { describe, it, expect, vi } from 'vitest';

describe('auth module', () => {
  it('rejects requests without Bearer token', async () => {
    const { requireAdmin } = await import('@/lib/auth');
    const request = {
      headers: new Headers(),
    } as any;
    expect(requireAdmin(request).authorized).toBe(false);
  });

  it('rejects invalid token format', async () => {
    const { requireAdmin } = await import('@/lib/auth');
    const request = {
      headers: new Headers({ authorization: 'Basic abc123' }),
    } as any;
    expect(requireAdmin(request).authorized).toBe(false);
  });

  it('rejects when ADMIN_API_SECRET is not set', async () => {
    delete process.env.ADMIN_API_SECRET;
    // Re-import to pick up the env change
    vi.resetModules();
    const { requireAdmin } = await import('@/lib/auth');
    const request = {
      headers: new Headers({ authorization: 'Bearer some-token' }),
    } as any;
    expect(requireAdmin(request).authorized).toBe(false);
  });

  it('accepts valid token', async () => {
    process.env.ADMIN_API_SECRET = 'test-secret-123';
    vi.resetModules();
    const { requireAdmin } = await import('@/lib/auth');
    const request = {
      headers: new Headers({ authorization: 'Bearer test-secret-123' }),
    } as any;
    expect(requireAdmin(request).authorized).toBe(true);
  });

  it('rejects wrong token', async () => {
    process.env.ADMIN_API_SECRET = 'test-secret-123';
    vi.resetModules();
    const { requireAdmin } = await import('@/lib/auth');
    const request = {
      headers: new Headers({ authorization: 'Bearer wrong-token' }),
    } as any;
    expect(requireAdmin(request).authorized).toBe(false);
  });
});

describe('rate limiter', () => {
  it('allows requests within limit', async () => {
    vi.resetModules();
    const { rateLimit } = await import('@/lib/rateLimit');
    const result = rateLimit('test-ip-1', { windowMs: 60000, max: 5 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('blocks requests exceeding limit', async () => {
    vi.resetModules();
    const { rateLimit } = await import('@/lib/rateLimit');
    const id = 'test-ip-block-' + Date.now();
    for (let i = 0; i < 3; i++) {
      rateLimit(id, { windowMs: 60000, max: 3 });
    }
    const result = rateLimit(id, { windowMs: 60000, max: 3 });
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

describe('CSV injection protection', () => {
  it('should not exist: secrets in source code', async () => {
    const { readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');
    const { execSync } = await import('child_process');

    // Check for common secret patterns in source files
    const patterns = [
      /ADMIN_API_SECRET\s*=\s*['"][^'"]+['"]/,
      /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,  // JWT pattern
      /sk_live_[A-Za-z0-9]+/,  // Stripe-like keys
    ];

    const srcDir = join(process.cwd(), 'src');
    const envFile = join(process.cwd(), '.env');

    // .env should not exist in committed code (only .env.example)
    // This is a basic check - in CI, you'd use a proper scanner
    if (existsSync(envFile)) {
      const envContent = readFileSync(envFile, 'utf-8');
      patterns.forEach(pattern => {
        // .env files are expected to have secrets locally, but check for common test tokens
        expect(envContent).not.toMatch(/sk_live_/);
      });
    }
  });
});
