import { describe, expect, test } from 'vitest';
import { ValiError } from '../../error/index.ts';
import { number, objectAsync, string } from '../../schemas/index.ts';
import { safeParseAsync } from './safeParseAsync.ts';
import { email, minLength } from '../../validations/index.ts';

describe('safeParseAsync', () => {
  test('should return data', async () => {
    const output1 = await safeParseAsync(string(), 'hello');
    expect(output1).toEqual({
      success: true,
      data: 'hello',
    });
    const output2 = await safeParseAsync(number(), 123);
    expect(output2).toEqual({
      success: true,
      data: 123,
    });
    const output3 = await safeParseAsync(objectAsync({ test: string() }), {
      test: 'hello',
    });
    expect(output3).toEqual({
      success: true,
      data: { test: 'hello' },
    });
  });

  test('should return error', async () => {
    const output1 = await safeParseAsync(string(), 123);
    expect(output1.success).toBe(false);
    if (!output1.success) {
      expect(output1.error).toBeInstanceOf(ValiError);
      expect(output1.error.message).toBe('Invalid type');
    }
    const output2 = await safeParseAsync(number(), 'hello');
    expect(output2.success).toBe(false);
    if (!output2.success) {
      expect(output2.error).toBeInstanceOf(ValiError);
      expect(output2.error.message).toBe('Invalid type');
    }
    const output3 = await safeParseAsync(objectAsync({ test: string() }), {});
    expect(output3.success).toBe(false);
    if (!output3.success) {
      expect(output3.error).toBeInstanceOf(ValiError);
      expect(output3.error.message).toBe('Invalid type');
    }
  });

  test('error should include multiple issues if abortEarly is disabled', async () => {
    const output = await safeParseAsync(
      string([email(), minLength(8)]),
      'hello@',
      {
        abortEarly: false,
      }
    );
    expect(output.success).toBe(false);
    if (output.success) {
      throw new Error('Output success should be false');
    }

    expect(output.error).toBeInstanceOf(ValiError);
    expect(output.error.issues.length).toBe(2);
    expect(output.error.issues[0].message).toBe('Invalid email');
    expect(output.error.issues[1].message).toBe('Invalid length');
  });
});
