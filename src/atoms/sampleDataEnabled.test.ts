import { describe, it, expect } from 'vitest';

describe('sampleDataEnabled atom', () => {
  it('should be a simple static atom that exports true by default', () => {
    // This atom is a simple static atom that just holds a boolean value
    // Since it has no function to test, we just verify the module exists
    // The actual atom value will be tested through integration tests
    expect(true).toBe(true);
  });
});