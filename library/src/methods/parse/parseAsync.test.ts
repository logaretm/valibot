import { describe, expect, test } from 'vitest';
import { numberAsync, object, string } from '../../schemas/index.ts';
import { parseAsync } from './parseAsync.ts';
import { email, minLength } from '../../validations/index.ts';
import { ValiError } from '../../error/index.ts';

describe('parseAsync', () => {
  test('should parse schema', async () => {
    const output1 = await parseAsync(string(), 'hello');
    expect(output1).toBe('hello');
    const output2 = await parseAsync(numberAsync(), 123);
    expect(output2).toBe(123);
    const output3 = await parseAsync(object({ test: string() }), {
      test: 'hello',
    });
    expect(output3).toEqual({ test: 'hello' });
  });

  test('should throw error', async () => {
    await expect(parseAsync(string(), 123)).rejects.toThrowError(
      'Invalid type'
    );
    await expect(parseAsync(numberAsync(), 'hello')).rejects.toThrowError(
      'Invalid type'
    );
    const objectSchema = object({ test: string() });
    await expect(parseAsync(objectSchema, {})).rejects.toThrowError(
      'Invalid type'
    );
  });

  test('should throw error with multiple issues if abortEarly is disabled', async () => {
    await expect(
      parseAsync(string([email(), minLength(8)]), 'hello@', {
        abortEarly: false,
      })
    ).rejects.toSatisfy((error) => {
      expect(error).toBeInstanceOf(ValiError);
      if (!(error instanceof ValiError)) {
        return false;
      }

      expect(error.issues.length).toBe(2);
      expect(error.issues[0].message).toBe('Invalid email');
      expect(error.issues[1].message).toBe('Invalid length');

      return true;
    });
  });
});
