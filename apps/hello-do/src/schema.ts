import { createSchema, createTableSchema, TableSchemaToRow } from '@rocicorp/zero/schema';

const issueSchema = createTableSchema({
	tableName: 'issue',
	columns: {
		id: { type: 'string' },
		shortID: { type: 'number', optional: true },
	},
	primaryKey: ['id'],
	relationships: {
		comments: {
			source: 'id',
			dest: {
				field: 'issueID',
				schema: () => commentSchema,
			},
		},
	},
});

const commentSchema = createTableSchema({
	tableName: 'comment',
	columns: {
		id: { type: 'string' },
		issueID: { type: 'string' },
		created: { type: 'number' },
		body: { type: 'string' },
		creatorID: { type: 'string' },
	},
	primaryKey: ['id'],
	relationships: {},
});

export const schema = createSchema({
	version: 4,
	tables: {
		issue: issueSchema,
		comment: commentSchema,
	},
});

export type Schema = typeof schema;
export type Comment = TableSchemaToRow<typeof commentSchema>;
