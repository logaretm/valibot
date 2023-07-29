import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { parse } from './parse.ts';
import { email, minLength } from '../../validations/index.ts';
import { ValiError } from '../../error/index.ts';

describe('parse', () => {
  test('should parse schema', () => {
    const output1 = parse(string(), 'hello');
    expect(output1).toBe('hello');
    const output2 = parse(number(), 123);
    expect(output2).toBe(123);
    const output3 = parse(object({ test: string() }), { test: 'hello' });
    expect(output3).toEqual({ test: 'hello' });
  });

  test('should throw error', () => {
    expect(() => parse(string(), 123)).toThrowError('Invalid type');
    expect(() => parse(number(), 'hello')).toThrowError('Invalid type');
    const objectSchema = object({ test: string() });
    expect(() => parse(objectSchema, {})).toThrowError('Invalid type');
  });

  test('should throw error with multiple issues if abortEarly is disabled', () => {
    expect(() =>
      parse(string([email(), minLength(8)]), 'hello@', { abortEarly: false })
    )
      .throws()
      .satisfies((error: Error) => {
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
