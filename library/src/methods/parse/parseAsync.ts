import type {
  BaseSchema,
  BaseSchemaAsync,
  Output,
  PipeExecutionOptions,
} from '../../types.ts';

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 *
 * @returns The parsed output.
 */
export async function parseAsync<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  input: unknown,
  opts?: PipeExecutionOptions
): Promise<Output<TSchema>> {
  return schema.parse(input, undefined, opts);
}
