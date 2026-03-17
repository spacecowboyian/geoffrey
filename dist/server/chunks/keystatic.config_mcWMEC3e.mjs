import { config, singleton, fields, collection } from '@keystatic/core';

const keystaticConfig = config({
  storage: {
    kind: "local"
  },
  collections: {
    buildLogs: collection({
      label: "Build Logs",
      slugField: "title",
      path: "content/build-logs/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date" }),
        vehicle: fields.select({
          label: "Vehicle",
          options: [
            { label: "1962 Renault Dauphine", value: "1962-renault-dauphine" }
          ],
          defaultValue: "1962-renault-dauphine"
        }),
        phase: fields.select({
          label: "Phase",
          options: [
            { label: "Teardown", value: "teardown" },
            { label: "Rust Repair", value: "rust-repair" },
            { label: "Suspension", value: "suspension" },
            { label: "Brakes", value: "brakes" },
            { label: "Engine", value: "engine" },
            { label: "Transmission", value: "transmission" },
            { label: "Wiring", value: "wiring" },
            { label: "Interior", value: "interior" },
            { label: "Paint", value: "paint" },
            { label: "Bodywork", value: "bodywork" },
            { label: "Testing", value: "testing" },
            { label: "Misc", value: "misc" }
          ],
          defaultValue: "misc"
        }),
        odometer: fields.integer({
          label: "Odometer (miles)",
          validation: { isRequired: false }
        }),
        hours: fields.number({
          label: "Hours Worked",
          validation: { isRequired: false }
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Planned", value: "planned" },
            { label: "In Progress", value: "in-progress" },
            { label: "Complete", value: "complete" },
            { label: "Blocked", value: "blocked" }
          ],
          defaultValue: "planned"
        }),
        partsUsed: fields.array(
          fields.text({ label: "Part" }),
          { label: "Parts Used" }
        ),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/build-logs",
          publicPath: "/images/build-logs",
          validation: { isRequired: false }
        }),
        gallery: fields.array(
          fields.image({
            label: "Gallery Image",
            directory: "public/images/build-logs",
            publicPath: "/images/build-logs"
          }),
          { label: "Gallery" }
        ),
        summary: fields.text({ label: "Summary", multiline: true }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/build-logs",
            publicPath: "/images/build-logs"
          }
        })
      }
    })
  },
  singletons: {
    siteSettings: singleton({
      label: "Site Settings",
      path: "content/site-settings",
      schema: {
        siteTitle: fields.text({ label: "Site Title" }),
        siteDescription: fields.text({ label: "Site Description" }),
        heroTitle: fields.text({ label: "Hero Title" }),
        heroText: fields.text({ label: "Hero Text", multiline: true }),
        aboutText: fields.text({ label: "About Text", multiline: true }),
        github: fields.url({ label: "GitHub URL", validation: { isRequired: false } }),
        instagram: fields.url({ label: "Instagram URL", validation: { isRequired: false } }),
        youtube: fields.url({ label: "YouTube URL", validation: { isRequired: false } })
      }
    })
  }
});

export { keystaticConfig as k };
