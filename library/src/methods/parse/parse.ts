import type { BaseSchema, Output, PipeExecutionOptions } from '../../types.ts';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 *
 * @returns The parsed output.
 */
export function parse<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown,
  opts?: PipeExecutionOptions
): Output<TSchema> {
  return schema.parse(input, undefined, opts);
}
