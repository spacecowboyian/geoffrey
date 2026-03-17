import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'buildLog',
  title: 'Build Log',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),

    defineField({
      name: 'vehicle',
      title: 'Vehicle',
      type: 'string',
      options: {
        list: [
          { title: '1962 Renault Dauphine', value: '1962-renault-dauphine' },
        ],
      },
      initialValue: '1962-renault-dauphine',
    }),

    defineField({
      name: 'phase',
      title: 'Phase',
      type: 'string',
      options: {
        list: [
          { title: 'Teardown', value: 'teardown' },
          { title: 'Rust Repair', value: 'rust-repair' },
          { title: 'Suspension', value: 'suspension' },
          { title: 'Brakes', value: 'brakes' },
          { title: 'Engine', value: 'engine' },
          { title: 'Transmission', value: 'transmission' },
          { title: 'Wiring', value: 'wiring' },
          { title: 'Interior', value: 'interior' },
          { title: 'Paint', value: 'paint' },
          { title: 'Bodywork', value: 'bodywork' },
          { title: 'Testing', value: 'testing' },
          { title: 'Misc', value: 'misc' },
        ],
      },
      initialValue: 'misc',
    }),

    defineField({
      name: 'odometer',
      title: 'Odometer (miles)',
      type: 'number',
    }),

    defineField({
      name: 'hours',
      title: 'Hours Worked',
      type: 'number',
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Planned', value: 'planned' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Complete', value: 'complete' },
          { title: 'Blocked', value: 'blocked' },
        ],
      },
      initialValue: 'planned',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'partsUsed',
      title: 'Parts Used',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
          ],
        },
      ],
    }),

    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      description: 'Pin this entry to the top of the homepage as the featured card. Only one entry should be featured at a time.',
      initialValue: false,
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
      ],
    }),
  ],

  orderings: [
    {
      title: 'Date, Newest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'coverImage',
    },
  },
});
