import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    // Try to import db only when needed and handle gracefully if not available
    try {
      const { db } = await import("./prisma");
      
      const loggedInUser = await db.user.findUnique({
        where: {
          clerkUserId: user.id,
        },
      });

      if (loggedInUser) {
        return loggedInUser;
      }

      const name = `${user.firstName} ${user.lastName}`;

      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
        },
      });

      return newUser;
    } catch (dbError) {
      console.log("Database not available:", dbError.message);
      // Return basic user info from Clerk if database is not available
      return {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress,
      };
    }
  } catch (error) {
    console.log("Error in checkUser:", error.message);
    return null;
  }
};
