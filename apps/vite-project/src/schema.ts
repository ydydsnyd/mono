export const schema = {
  counter: {
    tableName: 'counter',
    columns: {
      id: {type: 'string'},
      count: {type: 'number'},
    },
    primaryKey: ['id'],
    relationships: {},
  },
} as const;
export type Schema = typeof schema;
