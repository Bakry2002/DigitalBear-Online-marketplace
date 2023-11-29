import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";

const isAdminOrHasAccessToMedia =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined;

    if (!user) return false; // if the user is not logged in, he cannot access the media
    if (user.role === "admin") return true; // if the user is an admin, he can access the media

    return {
      user: {
        equals: req.user.id,
      },
    }; // if the user is not an admin, he can only access the media he uploaded
  };

export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    // lets you define a certain action to be performed when a certain event occurs
    beforeChange: [
      // lets you define a certain action to be performed before a certain event occurs
      ({ req, data }) => {
        return { ...data, user: req.user.id }; // associate the user with the media he uploaded/created
      },
    ],
  },
  access: {
    // use the access here to prevent other users from accessing the media uploaded by other users and tp prevent manipulation of the media by other users like deleting or editing
    read: async ({ req }) => {
      const referer = req.headers.referer; // get the referer from the request headers meaning the url from which the request was made

      if (!req.user || !referer?.includes("sell")) {
        // if the user is not logged in or the referer does not include the string "sell", he can access the media as it is not related to the products
        return true;
      }
      return await isAdminOrHasAccessToMedia()({ req });
    },
    delete: isAdminOrHasAccessToMedia(), // only admin or the user who uploaded the media can delete the media
    update: isAdminOrHasAccessToMedia(), // only admin or the user who uploaded the media can update the media
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin", // hide the collection from non-admin users
  },
  upload: {
    staticURL: `/media`, // the url where the files will be uploaded
    staticDir: "media", // the directory where the files will be stored
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined, // undefined means that the height will be automatically calculated
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"], // the types of files that can be uploaded
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
