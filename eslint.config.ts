import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  ignores: ['renderer/routes/generated/route-tree.gen.ts'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowExportNames: ['Route'] }],
  },
})
