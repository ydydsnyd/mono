export {jsonSchema} from 'shared/json.js';

/**
 * A JSON value that allows undefined values in objects.
 */
export type RelaxedJSONValue =
  | boolean
  | null
  | number
  | string
  | RelaxedJSONObject
  | RelaxedJSONArray;

type RelaxedJSONArray = ReadonlyArray<RelaxedJSONValue>;

type RelaxedJSONObject = {readonly [key: string]: RelaxedJSONValue | undefined};
