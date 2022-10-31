const {toEditorSettings} = require('typescript');

module.exports = {
  docs: [
    // TODO clean out the unused docs
    {
      'Get Started': [
        {
          type: 'category',
          label: 'Hello, Replicache',
          link: {
            type: 'doc',
            id: 'hello-replicache',
          },
          items: [
            'app-features',
            'app-structure',
            'first-replicache-feature',
            {
              'Next Steps': [
                'deploy-render',
                'deploy-elsewhere',
                'local-postgres',
              ],
            },
          ],
        },
        'quickstarts',
      ],
    },
    {
      Examples: ['example-todo', 'example-repliear', 'example-replidraw'],
    },
    {
      'Understand Replicache': [
        'how-it-works',
        'performance',
        'offline',
        'consistency',
        'faq', // TODO review
        // TODO what replicache is good for
      ],
    },
    {
      Reference: [
        {
          'JavaScript Reference': [
            {
              type: 'autogenerated',
              dirName: 'api', // 'api' is the 'out' directory
            },
          ],
        },
        'server-push',
        'server-pull',
      ],
    },
    {
      HOWTO: [
        {
          'Build Your Own Backend': [
            'guide-intro',
            'guide-install-replicache',
            'guide-design-client-view',
            'guide-render-ui',
            'guide-local-mutations',
            'guide-database-setup',
            'guide-database-schema',
            'guide-remote-mutations',
            'guide-dynamic-pull',
            'guide-poke',
            'guide-conclusion',
          ],
        },
        'howto-licensing',
        'howto-blobs',
        'howto-share-mutators',
        'howto-launch',
        //'howto-undo',
      ],
    },
  ],
};
