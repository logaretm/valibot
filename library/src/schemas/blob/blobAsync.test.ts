import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { blobAsync } from './blobAsync.ts';
import { maxSize } from '../../validations/index.ts';
import { ValiError } from '../../error/index.ts';

describe('blobAsync', () => {
  test('should pass only blobs', async () => {
    const schema = blobAsync();
    const input = new Blob(['123']);
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 2023)).rejects.toThrowError();
    await expect(parseAsync(schema, new Date())).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a blob!';
    await expect(parseAsync(blobAsync(error), 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const value = new Blob(['123']);
    const output = await parseAsync(blobAsync([() => value]), new Blob());
    expect(output).toBe(value);
  });

  test('should throw an error with multiple issues if abort early is disabled', () => {
    const schema = blobAsync([maxSize(1), maxSize(2)]);
    const value = new Blob(['123']);
    expect(() =>
      parseAsync(schema, value, { abortEarly: false })
    ).rejects.toSatisfy((error) => {
      expect(error).toBeInstanceOf(ValiError);
      if (!(error instanceof ValiError)) {
        return false;
      }

      expect(error.issues.length).toBe(2);
      expect(error.issues[0].message).toBe('Invalid size');
      expect(error.issues[1].message).toBe('Invalid size');

      return true;
    });
  });
});
