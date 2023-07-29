import { ValiError } from '../../error/index.ts';
import type { Issue, Issues } from '../../error/index.ts';
import type { Pipe, PipeExecutionOptions, ValidateInfo } from '../../types.ts';

/**
 * Executes the validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param info The validation info.
 *
 * @returns The output value.
 */
export function executePipe<TValue>(
  input: TValue,
  pipe: Pipe<TValue>,
  info: ValidateInfo,
  opts?: PipeExecutionOptions
): TValue {
  // By default it is true
  if (opts?.abortEarly ?? true) {
    return pipe.reduce((value, action) => action(value, info), input);
  }

  const issues: Issue[] = [];

  const endValue = pipe.reduce((value, action) => {
    try {
      return action(value, info);
    } catch (err) {
      if (err instanceof ValiError) {
        issues.push(...err.issues);
      } else {
        throw err;
      }

      return value;
    }
  }, input);

  if (issues.length > 0) {
    throw new ValiError(issues as Issues);
  }

  return endValue;
}
