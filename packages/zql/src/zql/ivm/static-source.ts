import {MemorySource} from './memory-source.js';
import {PrimaryKey, SchemaValue} from './schema.js';

export class StaticSource extends MemorySource {
  constructor(
    tableName: string,
    columns: Record<string, SchemaValue>,
    primaryKey: PrimaryKey,
  ) {
    super(tableName, columns, primaryKey);
  }
}

// source provider... querify... fml
// how would we get the source there?
// we don't want to look up from a source provider.
// the source should be passed.
// AST could reference the static source directly?
// Eh, it is a parameter.
// StaticParameter for querify??
// Static sources get put on as symbols
// and static parameters.
// Passed to query builder.
// AST needs some of this stuff? Since query is turned to AST before going to builder.
// So AST needs some static params on it that can be passed to builder and wouldn't be JSONified.
// Hmmm. or should they be jsonified? Can pass it to backend.
//
// Can we do it without querify?
//
// Row ref, auth data ref.
//
//
