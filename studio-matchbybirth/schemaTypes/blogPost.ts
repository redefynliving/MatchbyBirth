import {defineArrayMember, defineField, defineType} from 'sanity'

const relationshipTypes = [
  {title: 'Birth Matching', value: 'birth-matching'},
  {title: 'Zodiac Signs', value: 'zodiac'},
  {title: 'Numerology', value: 'numerology'},
  {title: 'Relationship Timing', value: 'relationship-timing'},
  {title: 'Friendship', value: 'friendship'},
  {title: 'Family', value: 'family'},
  {title: 'Workplace', value: 'workplace'},
  {title: 'Responsible Use', value: 'responsible-use'},
]

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'workflow', title: 'Workflow'},
    {name: 'enhancements', title: 'Enhancements'},
    {name: 'links', title: 'Links'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().min(8).max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'seo',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'content',
      initialValue: 'draft',
      options: {
        layout: 'radio',
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Ready to publish', value: 'ready'},
          {title: 'Published', value: 'published'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'approvalStatus',
      title: 'Approval status',
      type: 'string',
      group: 'workflow',
      initialValue: 'raw',
      description: 'Automation writes raw drafts, the rewrite pass marks ready, and Studio publish marks approved.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Raw automation draft', value: 'raw'},
          {title: 'Ready for review', value: 'ready'},
          {title: 'Approved and published', value: 'approved'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aiGenerated',
      title: 'AI-assisted draft',
      type: 'boolean',
      group: 'workflow',
      initialValue: false,
      description: 'Keeps provenance clear for posts that started from automation.',
    }),
    defineField({
      name: 'slopFlags',
      title: 'Rewrite / quality flags',
      type: 'array',
      group: 'workflow',
      of: [defineArrayMember({type: 'string'})],
      description: 'Automation can list generic phrasing, weak claims, or missing checks here.',
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'rawBody',
      title: 'Raw automation draft',
      type: 'text',
      rows: 12,
      group: 'workflow',
      description: 'First-pass Hermes draft. The reviewed article should live in Article body.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document || {}
          if ((document.status === 'published' || document.approvalStatus === 'approved') && !value) {
            return 'Published posts need a publish date.'
          }
          return true
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'content',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      group: 'content',
      options: {
        list: relationshipTypes,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short excerpt',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'One or two sentences shown in cards and previews.',
      validation: (rule) => rule.required().min(80).max(220),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      group: 'seo',
      description: 'Optional search title. Keep it under 60 characters.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Search result description. Keep it specific and under 160 characters.',
      validation: (rule) => rule.required().min(80).max(160),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'seo',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.max(140),
        }),
      ],
    }),
    defineField({
      name: 'quickTakeaways',
      title: 'Quick takeaways',
      type: 'array',
      group: 'enhancements',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(2).max(5),
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({
                        scheme: ['http', 'https', 'mailto'],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document || {}
          const needsFinalBody =
            document.status === 'published' ||
            document.approvalStatus === 'ready' ||
            document.approvalStatus === 'approved'

          if (!needsFinalBody) return true
          if (!Array.isArray(value) || value.length < 8) {
            return 'Ready or approved posts need a reviewed article body.'
          }
          return true
        }),
    }),
    defineField({
      name: 'exampleScenarios',
      title: 'Example scenarios',
      type: 'array',
      group: 'enhancements',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Scenario title',
              type: 'string',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'body',
              title: 'Scenario body',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().min(80).max(500),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'comparisonRows',
      title: 'Comparison rows',
      type: 'array',
      group: 'enhancements',
      description: 'Useful for methodology, timing, and sign-comparison articles.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'bestUse', title: 'Best use', type: 'text', rows: 2}),
            defineField({name: 'watchOut', title: 'Watch out', type: 'text', rows: 2}),
          ],
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'enhancements',
      description: 'Add 2-4 specific questions when the article needs extra clarity.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required().max(140),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().min(60).max(500),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related posts',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'blogPost'}],
          options: {disableNew: true},
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'calculatorCta',
      title: 'Show calculator call-to-action',
      type: 'boolean',
      group: 'links',
      initialValue: true,
    }),
    defineField({
      name: 'editorNotes',
      title: 'Editor notes',
      type: 'text',
      rows: 4,
      group: 'workflow',
      description:
        'Internal notes only. Keep claims responsible: Match by Birth Exact Mode improves Sun sign placement, not relationship certainty.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      approvalStatus: 'approvalStatus',
      media: 'heroImage',
    },
    prepare({title, subtitle, approvalStatus, media}) {
      return {
        title,
        subtitle: [approvalStatus, subtitle ? `Category: ${subtitle}` : 'No category selected']
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
