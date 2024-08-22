import { db } from "@/db";
import { publicProcedure, router } from "./trpc";
import z from "zod";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await db.user.findMany();
    return users;
  }),
  userById: publicProcedure.input(z.number()).query(async ({ input }) => {
    const user = await db.user.findUnique({ where: { id: input } });
    return user;
  }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const user = await db.user.create({ data: { name: input.name } });
      return user;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// Serving
const server = createHTTPServer({ router: appRouter });
server.listen(3000);
