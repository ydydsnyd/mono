export {
  IDBNotFoundError,
  TransactionClosedError,
  dropAllDatabases,
  dropDatabase,
  getDefaultPuller,
  makeIDBName,
} from 'replicache';
export type {
  AsyncIterableIteratorToArray,
  ClientGroupID,
  ClientID,
  CreateKVStore,
  ExperimentalDiff,
  ExperimentalDiffOperation,
  ExperimentalDiffOperationAdd,
  ExperimentalDiffOperationChange,
  ExperimentalDiffOperationDel,
  ExperimentalIndexDiff,
  ExperimentalNoIndexDiff,
  ExperimentalWatchCallbackForOptions,
  ExperimentalWatchIndexCallback,
  ExperimentalWatchIndexOptions,
  ExperimentalWatchNoIndexCallback,
  ExperimentalWatchNoIndexOptions,
  ExperimentalWatchOptions,
  GetIndexScanIterator,
  GetScanIterator,
  HTTPRequestInfo,
  IndexDefinition,
  IndexDefinitions,
  IndexKey,
  IterableUnion,
  JSONObject,
  JSONValue,
  KVRead,
  KVStore,
  KVWrite,
  KeyTypeForScanOptions,
  MaybePromise,
  MutatorDefs,
  MutatorReturn,
  PatchOperation,
  ReadTransaction,
  ReadonlyJSONObject,
  ReadonlyJSONValue,
  ScanIndexOptions,
  ScanNoIndexOptions,
  ScanOptionIndexedStartKey,
  ScanOptions,
  ScanResult,
  SubscribeOptions,
  TransactionEnvironment,
  TransactionLocation,
  TransactionReason,
  UpdateNeededReason,
  VersionNotSupportedResponse,
  WriteTransaction,
} from 'replicache';
export type {EntityQuery} from 'zql/src/zql/query2/entity-query.js';
export type {Entity} from 'zql/src/zql/schema/entity-schema.js';
export type {ZeroOptions} from './client/options.js';
export {Zero, type QueryDefs} from './client/zero.js';
