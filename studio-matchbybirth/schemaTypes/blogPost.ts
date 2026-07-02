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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
      initialValue: 'AJ FOX',
      validation: (rule) => rule.required().min(2).max(80),
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
      validation: (rule) => rule.required().min(8),
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
      group: 'content',
      description:
        'Internal notes only. Keep claims responsible: MBB Exact Mode improves Sun sign placement, not relationship certainty.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'heroImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? `Category: ${subtitle}` : 'No category selected',
        media,
      }
    },
  },
})
