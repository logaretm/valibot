import type { ValiError } from '../../error/index.ts';
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
export async function safeParseAsync<
  TSchema extends BaseSchema | BaseSchemaAsync
>(
  schema: TSchema,
  input: unknown,
  opts?: PipeExecutionOptions
): Promise<
  | { success: true; data: Output<TSchema> }
  | { success: false; error: ValiError }
> {
  try {
    return {
      success: true,
      data: await schema.parse(input, undefined, opts),
    };
  } catch (error) {
    return {
      success: false,
      error: error as ValiError,
    };
  }
}
