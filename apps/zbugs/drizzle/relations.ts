import { relations } from "drizzle-orm/relations";
import { user, issue, comment, label, issueLabel } from "./schema";

export const issueRelations = relations(issue, ({one, many}) => ({
	user: one(user, {
		fields: [issue.creatorId],
		references: [user.id]
	}),
	comments: many(comment),
	issueLabels: many(issueLabel),
}));

export const userRelations = relations(user, ({many}) => ({
	issues: many(issue),
	comments: many(comment),
}));

export const commentRelations = relations(comment, ({one}) => ({
	issue: one(issue, {
		fields: [comment.issueId],
		references: [issue.id]
	}),
	user: one(user, {
		fields: [comment.creatorId],
		references: [user.id]
	}),
}));

export const issueLabelRelations = relations(issueLabel, ({one}) => ({
	label: one(label, {
		fields: [issueLabel.labelId],
		references: [label.id]
	}),
	issue: one(issue, {
		fields: [issueLabel.issueId],
		references: [issue.id]
	}),
}));

export const labelRelations = relations(label, ({many}) => ({
	issueLabels: many(issueLabel),
}));