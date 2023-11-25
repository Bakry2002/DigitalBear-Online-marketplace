import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users", // The slug of the collection. Appears in the URL of the CMS// The fields of the collection
  auth: true,
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};
