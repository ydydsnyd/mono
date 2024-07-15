-- temp for zeppliear
CREATE INDEX issuelabel_issueid_idx ON "issueLabel" ("issueID");
CREATE INDEX issue_modified_idx ON issue (modified);
CREATE INDEX issue_created_idx ON issue (created);
CREATE INDEX issue_priority_modified_idx ON issue (priority,modified);
CREATE INDEX issue_status_modified_idx ON issue (status,modified);
CREATE INDEX comment_issueid_idx ON "comment" ("issueID");