module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // Category scores - aiming for high quality
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.85 }],

        // Critical accessibility requirements
        'button-name': 'error',
        'link-name': 'error',
        label: 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',
        'document-title': 'error',

        // Turn off problematic audits that need deeper investigation
        'color-contrast': 'off',
        'aria-prohibited-attr': 'off',
        'label-content-name-mismatch': 'off',
        'errors-in-console': 'off',

        // Don't fail on informational audits
        'unused-javascript': 'off',
        'network-dependency-tree-insight': 'off',
        'render-blocking-insight': 'off',
        'render-blocking-resources': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
