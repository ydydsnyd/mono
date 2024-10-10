import { pgTable, uniqueIndex, varchar, integer, index, foreignKey, boolean, doublePrecision, text } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const user = pgTable("user", {
	id: varchar().primaryKey().notNull(),
	login: varchar().notNull(),
	name: varchar().notNull(),
	avatar: varchar(),
	role: varchar().default('user').notNull(),
	githubId: integer().notNull(),
},
(table) => {
	return {
		githubidIdx: uniqueIndex("user_githubid_idx").using("btree", table.githubId.asc().nullsLast()),
		loginIdx: uniqueIndex("user_login_idx").using("btree", table.login.asc().nullsLast()),
	}
});

export const issue = pgTable("issue", {
	id: varchar().primaryKey().notNull(),
	shortId: integer().generatedByDefaultAsIdentity({ name: ""issue_shortID_seq"", startWith: 3000, increment: 1, minValue: 1, maxValue: 2147483647 }),
	title: varchar().notNull(),
	open: boolean().notNull(),
	modified: doublePrecision().default(sql`(EXTRACT(epoch FROM CURRENT_TIMESTAMP) * (1000)::numeric)`),
	created: doublePrecision().default(sql`(EXTRACT(epoch FROM CURRENT_TIMESTAMP) * (1000)::numeric)`),
	creatorId: varchar().notNull(),
	description: text().default(''),
	labelIds: text(),
},
(table) => {
	return {
		createdIdx: index("issue_created_idx").using("btree", table.created.asc().nullsLast()),
		modifiedIdx: index("issue_modified_idx").using("btree", table.modified.asc().nullsLast()),
		openModifiedIdx: index("issue_open_modified_idx").using("btree", table.open.asc().nullsLast(), table.modified.asc().nullsLast()),
		issueCreatorIdFkey: foreignKey({
			columns: [table.creatorId],
			foreignColumns: [user.id],
			name: "issue_creatorID_fkey"
		}),
	}
});

export const comment = pgTable("comment", {
	id: varchar().primaryKey().notNull(),
	issueId: varchar(),
	created: doublePrecision(),
	body: text().notNull(),
	creatorId: varchar(),
},
(table) => {
	return {
		issueidIdx: index("comment_issueid_idx").using("btree", table.issueId.asc().nullsLast()),
		commentIssueIdFkey: foreignKey({
			columns: [table.issueId],
			foreignColumns: [issue.id],
			name: "comment_issueID_fkey"
		}).onDelete("cascade"),
		commentCreatorIdFkey: foreignKey({
			columns: [table.creatorId],
			foreignColumns: [user.id],
			name: "comment_creatorID_fkey"
		}),
	}
});

export const label = pgTable("label", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
});

export const issueLabel = pgTable("issueLabel", {
	id: varchar().primaryKey().notNull(),
	labelId: varchar(),
	issueId: varchar(),
},
(table) => {
	return {
		issuelabelIssueidIdx: index("issuelabel_issueid_idx").using("btree", table.issueId.asc().nullsLast()),
		issueLabelLabelIdFkey: foreignKey({
			columns: [table.labelId],
			foreignColumns: [label.id],
			name: "issueLabel_labelID_fkey"
		}),
		issueLabelIssueIdFkey: foreignKey({
			columns: [table.issueId],
			foreignColumns: [issue.id],
			name: "issueLabel_issueID_fkey"
		}).onDelete("cascade"),
	}
});