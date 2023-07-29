import type { Issue, Issues } from '../../error/index.ts';
import { ValiError } from '../../error/index.ts';
import type {
  PipeAsync,
  PipeExecutionOptions,
  ValidateInfo,
} from '../../types.ts';

/**
 * Executes the async validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param info The validation info.
 *
 * @returns The output value.
 */
export async function executePipeAsync<TValue>(
  input: TValue,
  pipe: PipeAsync<TValue>,
  info: ValidateInfo,
  opts?: PipeExecutionOptions
): Promise<TValue> {
  if (opts?.abortEarly ?? true) {
    return pipe.reduce<Promise<TValue>>(
      async (value, action) => action(await value, info),
      Promise.resolve(input)
    );
  }

  const issues: Issue[] = [];

  const endValue = await pipe.reduce<Promise<TValue>>(async (value, action) => {
    try {
      const next = await action(await value, info);

      return next;
    } catch (err) {
      if (err instanceof ValiError) {
        issues.push(...err.issues);
      } else {
        throw err;
      }

      return value;
    }
  }, Promise.resolve(input));

  if (issues.length > 0) {
    throw new ValiError(issues as Issues);
  }

  return endValue;
}
