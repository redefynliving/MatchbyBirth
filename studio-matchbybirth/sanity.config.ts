import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {ApproveAndPublishAction} from './actions/ApproveAndPublishAction'

export default defineConfig({
  name: 'default',
  title: 'matchbybirth',

  projectId: '4qj4p6px',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) =>
      context.schemaType === 'blogPost'
        ? prev.map((action) =>
            action.action === 'publish' ? ApproveAndPublishAction : action,
          )
        : prev,
  },
})
