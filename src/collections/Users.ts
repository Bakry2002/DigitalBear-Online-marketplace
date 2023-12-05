import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";
import { Access, CollectionConfig } from "payload/types";

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true; // if user is admin, then they can read all the users

  return {
    id: {
      equals: user.id,
    }, // if user is not admin, then they can only read their own user
  };
};

export const Users: CollectionConfig = {
  slug: "users", // The slug of the collection. Appears in the URL of the CMS// The fields of the collection
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        console.log(token);
        // return `<a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}">Click here to verify your email</a>`;
        return PrimaryActionEmailHtml({
          actionLabel: "Verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
        });
      },
    },
  },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === "admin", // only admin can update users
    delete: ({ req }) => req.user.role === "admin", // only admin can update users
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin", // if user is not admin, then they can't see the users collection
    defaultColumns: ["id"], // the columns that will be shown in the admin UI
  },
  fields: [
    {
      name: "products",
      label: "Products",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product Files",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "product_files",
    },
    {
      name: "role",
      required: true,
      defaultValue: "user",
      //   admin: {
      //     condition: () => false,
      //   },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};
