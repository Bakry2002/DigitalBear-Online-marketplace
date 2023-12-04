import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { CollectionConfig } from "payload/types";
import { Product } from "../../payload-types";
import { stripe } from "../../lib/stripe";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;
  return { ...data, user: user.id }; // add the user id to the product
};
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name", // Use the "name" field as the title  meaning that it will be used in the admin panel
  },
  access: {}, // Who have the access to this collection
  hooks: {
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === "create") {
          const data = args.data as Product;

          // Create the Fee for the product
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              unit_amount: Math.round(data.price * 100), // stripe only accepts cents
            },
          });

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };

          return updated; // return the updated data
        } else if (args.operation === "update") {
          const data = args.data as Product;

          // Create the Fee for the product
          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          };

          return updated; // return the updated data
        }
      },
    ],
  }, // Hooks are functions that run before or after certain events
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users", // The collection that this field is related to
      required: true,
      hasMany: false, // one product cannot be created by multiple users
      admin: {
        condition: () => false, // This field will not be shown in the admin panel
      },
    },
    {
      name: "name",
      type: "text",
      label: "Product_name",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Product_description",
    },
    {
      name: "price",
      label: "Product_price (in USD)",
      required: true,
      min: 0,
      max: 1000,
      type: "number",
    },
    {
      name: "category",
      type: "select",
      label: "Product_category",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      relationTo: "product_files",
      required: true,
      hasMany: false, // true if you want to allow multiple files to be uploaded
    },
    {
      name: "priceId",
      access: {
        create: () => false, // neither admin nor user can create this field, but developer can with overrideAccess in the config
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false, // neither admin nor user can create this field, but developer can with overrideAccess in the config
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "approvedForSale",
      label: "Product_status",
      type: "select",
      defaultValue: "pending",
      access: {
        // Only admin can create, read and update this field
        create: ({ req }) => req.user?.role === "admin",
        read: ({ req }) => req.user?.role === "admin",
        update: ({ req }) => req.user?.role === "admin",
      },
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Rejected",
          value: "rejected",
        },
      ],
    },
    {
      name: "images",
      type: "array",
      label: "Product_images",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Product_image",
        plural: "Product_images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
