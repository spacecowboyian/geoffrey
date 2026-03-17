import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',

  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
    }),

    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'aboutText',
      title: 'About Text',
      type: 'text',
      rows: 6,
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'GitHub', value: 'GitHub' },
                  { title: 'Instagram', value: 'Instagram' },
                  { title: 'YouTube', value: 'YouTube' },
                  { title: 'Twitter / X', value: 'Twitter / X' },
                  { title: 'Facebook', value: 'Facebook' },
                  { title: 'Other', value: 'Other' },
                ],
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
  ],

  preview: {
    select: { title: 'siteTitle' },
    prepare({ title }) {
      return { title: title ?? 'Site Settings' };
    },
  },
});
