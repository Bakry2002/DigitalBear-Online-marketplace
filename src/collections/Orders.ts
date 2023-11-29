import { Access, CollectionConfig } from "payload/types";

const yourOwnOrders: Access = ({ req: { user } }) => {
  if (user?.role === "admin") return true; // if the user is an admin, he can access the orders

  return {
    user: {
      equals: user?.id,
    }, // if the user is not an admin, he can only access the orders he created
  };
};

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your orders",
    description:
      "A summary of all your orders and their status on DigitalBeer.",
  },
  access: {
    read: yourOwnOrders, // only the user who created the order can read the order
    update: ({ req }) => req.user?.role === "admin", // only admin can update the order
    delete: ({ req }) => req.user?.role === "admin", // only admin can update the order
    create: ({ req }) => req.user?.role === "admin", // only admin can update the order
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user?.role === "admin",
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: true, // one order can have multiple products
    },
  ],
};
