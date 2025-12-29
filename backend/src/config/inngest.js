import { Inngest } from "inngest";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "ecommerce-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      const newUser = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        imageUrl: image_url,
        addresses: [],
        wishlist: [],
      };

      await User.create(newUser);
      console.log(`User synced to DB:, ${id}`);
    } catch (error) {
      console.error(`Failes to sync user ${event.data.id}: `, error);
      throw error; // Re-throw to let Inngest handle retries if needed
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      // Optional: await connectDB(); if your environment needs it

      const { id } = event.data; // ✅ Clerk User ID

      if (!id) {
        console.warn("No Clerk User ID provided in the event:", event);
        return;
      }

      const result = await User.deleteOne({ clerkId: id });

      if (result.deletedCount === 0) {
        console.warn(`No user found for deletion with clerkId: ${id}`);
      } else {
        console.log(`User deleted from DB: ${id}`);
      }
    } catch (error) {
      console.error(`Failed to delete user ${event.data.id}:`, error);
      throw error; // let Inngest handle retries
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];
