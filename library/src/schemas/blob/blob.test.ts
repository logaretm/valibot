import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { blob } from './blob.ts';
import { maxSize } from '../../validations/index.ts';
import { ValiError } from '../../error/index.ts';

describe('blob', () => {
  test('should pass only blobs', () => {
    const schema = blob();
    const input = new Blob(['123']);
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 2023)).toThrowError();
    expect(() => parse(schema, new Date())).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a blob!';
    expect(() => parse(blob(error), 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const value = new Blob(['123']);
    const output = parse(blob([() => value]), new Blob());
    expect(output).toBe(value);
  });

  test('should throw an error with multiple issues if abort early is disabled', () => {
    const value = new Blob(['123']);
    const schema = blob([maxSize(1), maxSize(2)]);
    expect(() => parse(schema, value, { abortEarly: false }))
      .throws()
      .satisfies((error: ValiError) => {
        expect(error).toBeInstanceOf(ValiError);

        expect(error.issues.length).toBe(2);
        expect(error.issues[0].message).toBe('Invalid size');
        expect(error.issues[1].message).toBe('Invalid size');

        return true;
      });
  });
});
