import {
  createSchema,
  defineAuthorization,
  table,
  column,
  type ExpressionBuilder,
  type TableSchema,
  type TableSchemaToRow,
} from '@rocicorp/zero';

const {string, number, boolean} = column;

const user = table('user')
  .columns({
    id: string(),
    login: string(),
    name: string(),
    avatar: string(),
    role: string(),
  })
  .primaryKey('id')
  .build();

const issue = table('issue')
  .columns({
    id: string(),
    shortID: number().optional(),
    title: string(),
    open: boolean(),
    modified: number(),
    created: number(),
    creatorID: string(),
    assigneeID: string().optional(),
    description: string(),
    labelIDs: string(),
  })
  .primaryKey('id')
  .relationships(source => ({
    labels: source('id')
      .junction(() => issueLabel, 'issueID', 'labelID')
      .dest(() => label, 'id'),
    comments: source('id').dest(() => comment, 'issueID'),
    creator: source('creatorID').dest(user, 'id'),
    assignee: source('assigneeID').dest(user, 'id'),
    viewState: source('id').dest(() => viewState, 'issueID'),
    emoji: source('id').dest(() => emoji, 'subjectID'),
  }))
  .build();

const viewState = table('viewState')
  .columns({
    issueID: string(),
    userID: string(),
    viewed: number(),
  })
  .primaryKey('issueID', 'userID')
  .build();

const comment = table('comment')
  .columns({
    id: string(),
    issueID: string(),
    created: number(),
    body: string(),
    creatorID: string(),
  })
  .primaryKey('id')
  .relationships(source => ({
    creator: source('creatorID').dest(user, 'id'),
    emoji: source('id').dest(() => emoji, 'subjectID'),
  }))
  .build();

const label = table('label')
  .columns({
    id: string(),
    name: string(),
  })
  .primaryKey('id')
  .build();

const issueLabel = table('issueLabel')
  .columns({
    issueID: string(),
    labelID: string(),
  })
  .primaryKey('issueID', 'labelID')
  .build();

const emoji = table('emoji')
  .columns({
    id: string(),
    value: string(),
    annotation: string(),
    subjectID: string(),
    creatorID: string(),
    created: number(),
  })
  .primaryKey('id')
  .relationships(source => ({
    creator: source('creatorID').dest(user, 'id'),
  }))
  .build();

const userPref = table('userPref')
  .columns({
    userID: string(),
    key: string(),
    value: string(),
  })
  .primaryKey('key', 'userID') // TODO: this order should be reversed, right?
  .build();

export const schema = createSchema({
  version: 4,
  tables: {
    user,
    issue,
    comment,
    label,
    issueLabel,
    viewState,
    emoji,
    userPref,
  },
});

export type IssueRow = TableSchemaToRow<typeof issue>;
export type CommentRow = TableSchemaToRow<typeof comment>;
export type Schema = typeof schema;

/** The contents of the zbugs JWT */
type AuthData = {
  // The logged in userID.
  sub: string;
  role: 'crew' | 'user';
};

const authorization = defineAuthorization<AuthData, Schema>(schema, () => {
  const allowIfLoggedIn = (
    authData: AuthData,
    {cmpLit}: ExpressionBuilder<TableSchema>,
  ) => cmpLit(authData.sub, 'IS NOT', null);

  const allowIfIssueCreator = (
    authData: AuthData,
    {cmp}: ExpressionBuilder<typeof issue>,
  ) => cmp('creatorID', '=', authData.sub);

  const allowIfCommentCreator = (
    authData: AuthData,
    {cmp}: ExpressionBuilder<typeof comment>,
  ) => cmp('creatorID', '=', authData.sub);

  const allowIfAdmin = (
    authData: AuthData,
    {cmpLit}: ExpressionBuilder<TableSchema>,
  ) => cmpLit(authData.role, '=', 'crew');

  const allowIfUserIDMatchesLoggedInUser = (
    authData: AuthData,
    {cmp}: ExpressionBuilder<typeof viewState>,
  ) => cmp('userID', '=', authData.sub);

  return {
    user: {
      // Only the authentication system can write to the user table.
      row: {
        insert: [],
        update: {
          preMutation: [],
        },
        delete: [],
      },
    },
    issue: {
      row: {
        insert: [allowIfLoggedIn],
        update: {
          preMutation: [allowIfIssueCreator, allowIfAdmin],
        },
        delete: [allowIfIssueCreator, allowIfAdmin],
      },
    },
    comment: {
      row: {
        insert: [allowIfLoggedIn],
        update: {
          preMutation: [allowIfCommentCreator, allowIfAdmin],
        },
        delete: [allowIfCommentCreator, allowIfAdmin],
      },
    },
    label: {
      row: {
        insert: [allowIfAdmin],
        update: {
          preMutation: [allowIfAdmin],
        },
        delete: [allowIfAdmin],
      },
    },
    viewState: {
      row: {
        insert: [allowIfUserIDMatchesLoggedInUser],
        update: {
          preMutation: [allowIfUserIDMatchesLoggedInUser],
          postProposedMutation: [allowIfUserIDMatchesLoggedInUser],
        },
        // view state cannot be deleted
        delete: [],
      },
    },
    // TODO (mlaw): issueLabel permissions (only issue creator can set)
  };
});

// TODO (mlaw): once we move auth to be defined on the table, there will be a single default export which is
// the schema. Working towards this next.
const exported: {
  schema: typeof schema;
  authorization: ReturnType<typeof defineAuthorization>;
} = {
  schema,
  authorization,
};
export default exported;
