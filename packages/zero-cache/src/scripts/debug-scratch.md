# Full Query:

```json
{
  "table": "issue",
  "orderBy": [["id", "asc"]],
  "related": [
    {
      "system": "client",
      "subquery": {
        "alias": "assignee",
        "table": "user",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["id"], "parentField": ["assigneeID"]}
    },
    {
      "system": "client",
      "subquery": {
        "alias": "comments",
        "limit": 10,
        "table": "comment",
        "orderBy": [["id", "asc"]],
        "related": [
          {
            "system": "client",
            "subquery": {
              "alias": "emoji",
              "table": "emoji",
              "orderBy": [["id", "asc"]]
            },
            "correlation": {"childField": ["subjectID"], "parentField": ["id"]}
          }
        ],
        "where": {
          "type": "correlatedSubquery",
          "related": {
            "system": "permissions",
            "correlation": {"parentField": ["issueID"], "childField": ["id"]},
            "subquery": {
              "table": "issue",
              "alias": "zsubq_issue",
              "where": {
                "type": "or",
                "conditions": [
                  {
                    "type": "simple",
                    "left": {"type": "literal", "value": null},
                    "right": {"type": "literal", "value": "crew"},
                    "op": "="
                  },
                  {
                    "type": "simple",
                    "left": {"type": "column", "name": "visibility"},
                    "right": {"type": "literal", "value": "public"},
                    "op": "="
                  }
                ]
              },
              "orderBy": [["id", "asc"]]
            }
          },
          "op": "EXISTS"
        }
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    },
    {
      "system": "client",
      "subquery": {
        "alias": "creator",
        "table": "user",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["id"], "parentField": ["creatorID"]}
    },
    {
      "system": "client",
      "subquery": {
        "alias": "emoji",
        "table": "emoji",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["subjectID"], "parentField": ["id"]}
    },
    {
      "system": "client",
      "subquery": {
        "alias": "labels",
        "table": "issueLabel",
        "orderBy": [
          ["issueID", "asc"],
          ["labelID", "asc"]
        ],
        "related": [
          {
            "hidden": true,
            "system": "client",
            "subquery": {
              "alias": "labels",
              "table": "label",
              "orderBy": [["id", "asc"]]
            },
            "correlation": {"childField": ["id"], "parentField": ["labelID"]}
          }
        ],
        "where": {
          "type": "correlatedSubquery",
          "related": {
            "system": "permissions",
            "correlation": {"parentField": ["issueID"], "childField": ["id"]},
            "subquery": {
              "table": "issue",
              "alias": "zsubq_issue",
              "where": {
                "type": "or",
                "conditions": [
                  {
                    "type": "simple",
                    "left": {"type": "literal", "value": null},
                    "right": {"type": "literal", "value": "crew"},
                    "op": "="
                  },
                  {
                    "type": "simple",
                    "left": {"type": "column", "name": "visibility"},
                    "right": {"type": "literal", "value": "public"},
                    "op": "="
                  }
                ]
              },
              "orderBy": [["id", "asc"]]
            }
          },
          "op": "EXISTS"
        }
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    },
    {
      "system": "client",
      "subquery": {
        "alias": "viewState",
        "limit": 1,
        "table": "viewState",
        "where": {
          "op": "=",
          "left": {"name": "userID", "type": "column"},
          "type": "simple",
          "right": {"type": "literal", "value": "anon"}
        },
        "orderBy": [
          ["userID", "asc"],
          ["issueID", "asc"]
        ]
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    }
  ],
  "where": {
    "type": "or",
    "conditions": [
      {
        "type": "simple",
        "left": {"type": "literal", "value": null},
        "right": {"type": "literal", "value": "crew"},
        "op": "="
      },
      {
        "type": "simple",
        "left": {"type": "column", "name": "visibility"},
        "right": {"type": "literal", "value": "public"},
        "op": "="
      }
    ]
  }
}
```

Result:

```sh
issue VENDED:  [
  [
    'SELECT "assigneeID","created","creatorID","description","id","modified","open","shortID","title","visibility" FROM "issue" WHERE (? = ? OR "visibility" = ?) ORDER BY "id" asc',
    1028
  ],
  [
    'SELECT "assigneeID","created","creatorID","description","id","modified","open","shortID","title","visibility" FROM "issue" WHERE "id" = ? AND (? = ? OR "visibility" = ?) ORDER BY "id" asc',
    4420
  ]
]
user VENDED:  [
  [
    'SELECT "avatar","id","login","name","role" FROM "user" WHERE "id" = ? ORDER BY "id" asc',
    514
  ]
]
comment VENDED:  [
  [
    'SELECT "body","created","creatorID","id","issueID" FROM "comment" WHERE "issueID" = ? ORDER BY "id" asc',
    888
  ],
  [
    'SELECT "body","created","creatorID","id","issueID" FROM "comment" WHERE (("id" > ?) OR ("id" = ?)) ORDER BY "id" asc',
    628
  ]
]
emoji VENDED:  []
issueLabel VENDED:  [
  [
    'SELECT "issueID","labelID" FROM "issueLabel" WHERE "issueID" = ? ORDER BY "issueID" asc, "labelID" asc',
    601
  ],
  [
    'SELECT "issueID","labelID" FROM "issueLabel" WHERE (("issueID" > ?) OR ("issueID" = ? AND "labelID" > ?) OR ("issueID" = ? AND "labelID" = ?)) ORDER BY "issueID" asc, "labelID" asc',
    826
  ]
]
label VENDED:  [
  [
    'SELECT "id","name" FROM "label" WHERE "id" = ? ORDER BY "id" asc',
    601
  ]
]
viewState VENDED:  []
ROWS CONSIDERED: 9506
TIME: 185.35 ms
```

# Issues And Labels

```json
{
  "table": "issue",
  "orderBy": [["id", "asc"]],
  "related": [
    {
      "subquery": {
        "alias": "assignee",
        "table": "user",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["id"], "parentField": ["assigneeID"]}
    },
    {
      "subquery": {
        "alias": "labels",
        "table": "issueLabel",
        "orderBy": [
          ["issueID", "asc"],
          ["labelID", "asc"]
        ],
        "related": [
          {
            "hidden": true,
            "subquery": {
              "alias": "labels",
              "table": "label",
              "orderBy": [["id", "asc"]]
            },
            "correlation": {"childField": ["id"], "parentField": ["labelID"]}
          }
        ]
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    }
  ]
}
```

```sh
issue VENDED:  [
  [
    'SELECT "assigneeID","created","creatorID","description","id","modified","open","shortID","title","visibility" FROM "issue" ORDER BY "id" asc',
    516
  ]
]
user VENDED:  []
issueLabel VENDED:  [
  [
    'SELECT "issueID","labelID" FROM "issueLabel" WHERE "issueID" = ? ORDER BY "issueID" asc, "labelID" asc',
    603
  ]
]
label VENDED:  [
  [
    'SELECT "id","name" FROM "label" WHERE "id" = ? ORDER BY "id" asc',
    603
  ]
]
ROWS CONSIDERED: 1722
TIME: 43.69 ms
```

# Issue, Comments, Emoji, Creator, Assignee

```json
{
  "table": "issue",
  "orderBy": [["id", "asc"]],
  "related": [
    {
      "subquery": {
        "alias": "assignee",
        "table": "user",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["id"], "parentField": ["assigneeID"]}
    },
    {
      "subquery": {
        "alias": "comments",
        "limit": 10,
        "table": "comment",
        "orderBy": [["id", "asc"]],
        "related": [
          {
            "subquery": {
              "alias": "emoji",
              "table": "emoji",
              "orderBy": [["id", "asc"]]
            },
            "correlation": {"childField": ["subjectID"], "parentField": ["id"]}
          }
        ]
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    },
    {
      "subquery": {
        "alias": "creator",
        "table": "user",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["id"], "parentField": ["creatorID"]}
    },
    {
      "subquery": {
        "alias": "emoji",
        "table": "emoji",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["subjectID"], "parentField": ["id"]}
    }
  ]
}
```

Result:

```sh
issue VENDED:  [
  [
    'SELECT "assigneeID","created","creatorID","description","id","modified","open","shortID","title","visibility" FROM "issue" ORDER BY "id" asc',
    516
  ]
]
user VENDED:  [
  [
    'SELECT "avatar","id","login","name","role" FROM "user" WHERE "id" = ? ORDER BY "id" asc',
    516
  ]
]
comment VENDED:  [
  [
    'SELECT "body","created","creatorID","id","issueID" FROM "comment" WHERE "issueID" = ? ORDER BY "id" asc',
    901
  ]
]
emoji VENDED:  []
ROWS CONSIDERED: 1933
TIME: 64.28 ms
```

# Issues, Labels, Comments, View State, Emoji

```json
{
  "table": "issue",
  "orderBy": [["id", "asc"]],
  "related": [
    {
      "subquery": {
        "alias": "assignee",
        "table": "user",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["id"], "parentField": ["assigneeID"]}
    },
    {
      "subquery": {
        "alias": "comments",
        "limit": 10,
        "table": "comment",
        "orderBy": [["id", "asc"]],
        "related": [
          {
            "subquery": {
              "alias": "emoji",
              "table": "emoji",
              "orderBy": [["id", "asc"]]
            },
            "correlation": {"childField": ["subjectID"], "parentField": ["id"]}
          }
        ]
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    },
    {
      "subquery": {
        "alias": "creator",
        "table": "user",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["id"], "parentField": ["creatorID"]}
    },
    {
      "subquery": {
        "alias": "emoji",
        "table": "emoji",
        "orderBy": [["id", "asc"]]
      },
      "correlation": {"childField": ["subjectID"], "parentField": ["id"]}
    },
    {
      "subquery": {
        "alias": "labels",
        "table": "issueLabel",
        "orderBy": [
          ["issueID", "asc"],
          ["labelID", "asc"]
        ],
        "related": [
          {
            "hidden": true,
            "subquery": {
              "alias": "labels",
              "table": "label",
              "orderBy": [["id", "asc"]]
            },
            "correlation": {"childField": ["id"], "parentField": ["labelID"]}
          }
        ]
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    },
    {
      "subquery": {
        "alias": "viewState",
        "limit": 1,
        "table": "viewState",
        "where": {
          "op": "=",
          "left": {"name": "userID", "type": "column"},
          "type": "simple",
          "right": {"type": "literal", "value": "tDY6IbKdVqbBlRBc3XMwF"}
        },
        "orderBy": [
          ["userID", "asc"],
          ["issueID", "asc"]
        ]
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    }
  ]
}
```

---

```json
{
  "table": "issue",
  "orderBy": [["id", "asc"]],
  "related": [
    {
      "system": "client",
      "subquery": {
        "alias": "comments",
        "limit": 10,
        "table": "comment",
        "orderBy": [["id", "asc"]],
        "related": [
          {
            "system": "client",
            "subquery": {
              "alias": "emoji",
              "table": "emoji",
              "orderBy": [["id", "asc"]]
            },
            "correlation": {"childField": ["subjectID"], "parentField": ["id"]}
          }
        ],
        "where": {
          "type": "correlatedSubquery",
          "related": {
            "system": "permissions",
            "correlation": {"parentField": ["issueID"], "childField": ["id"]},
            "subquery": {
              "table": "issue",
              "alias": "zsubq_issue",
              "where": {
                "type": "or",
                "conditions": [
                  {
                    "type": "simple",
                    "left": {"type": "literal", "value": null},
                    "right": {"type": "literal", "value": "crew"},
                    "op": "="
                  },
                  {
                    "type": "simple",
                    "left": {"type": "column", "name": "visibility"},
                    "right": {"type": "literal", "value": "public"},
                    "op": "="
                  }
                ]
              },
              "orderBy": [["id", "asc"]]
            }
          },
          "op": "EXISTS"
        }
      },
      "correlation": {"childField": ["issueID"], "parentField": ["id"]}
    }
  ]
}
```

```sh
issue VENDED:  [
  [
    'SELECT "assigneeID","created","creatorID","description","id","modified","open","shortID","title","visibility" FROM "issue" ORDER BY "id" asc',
    516
  ],
  [
    'SELECT "assigneeID","created","creatorID","description","id","modified","open","shortID","title","visibility" FROM "issue" WHERE "id" = ? AND (? = ? OR "visibility" = ?) ORDER BY "id" asc',
    2392
  ]
]
comment VENDED:  [
  [
    'SELECT "body","created","creatorID","id","issueID" FROM "comment" WHERE "issueID" = ? ORDER BY "id" asc',
    901
  ],
  [
    'SELECT "body","created","creatorID","id","issueID" FROM "comment" WHERE (("id" > ?) OR ("id" = ?)) ORDER BY "id" asc',
    632
  ]
]
emoji VENDED:  []
ROWS CONSIDERED: 4441
TIME: 102.66 ms
```

w/o `OR` we cut considerations in half. Fetch is obvs inefficient here since we re-fetch...
Can we split it?
