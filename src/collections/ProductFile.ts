import { User } from "@/payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  // get the user from the request object
  const user = req.user as User | null;

  return { ...data, user: user?.id }; // associate the user with the product_files he uploaded/created
};

const youOwnOrPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (user?.role === "admin") return true; // if the user is an admin, he can access the product_files
  if (!user) return false; // if the user is not logged in, he cannot access the product_files

  // get the ids of the product_files that this currently logged in user owns
  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0, // get the product_files that are directly related to the products
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // what you own
  const ownedProductFileIds = products // get the product_files that are directly related to the products
    .map((product) => product.product_files)
    .flat(); // what flat() does is that it takes an array of arrays and returns an array of the elements of the arrays for example: [[1,2],[3,4]] becomes [1,2,3,4]

  // get the ids of the product_files that this currently logged in user bought
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2, // get the product_files that are directly related to the products that are directly related to the orders
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string") {
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs."
          );
        }

        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
    })
    .filter(Boolean)
    .flat(); // what filter(Boolean) does is that it removes all the falsy values from the array for example: [1,2,3,4,0] becomes [1,2,3,4]

  return {
    id: {
      in: [...ownedProductFileIds, ...purchasedProductFileIds], // the user can only access the product_files that he owns or purchased
    },
  };
};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin", // hide the collection from non-admin users
  },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: youOwnOrPurchased, // only the user who uploaded the product_files or the user who purchased the product can read the product_files
    update: ({ req }) => req.user?.role === "admin", // only admin can update the product_files
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticURL: `/product_files`, // the url where the files will be uploaded
    staticDir: "product_files", // the directory where the files will be stored
    mimeTypes: ["image/*", "font/*", "application/postscript"], // the types of files that can be uploaded, you can add as much as you want
  },
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
  ],
};
