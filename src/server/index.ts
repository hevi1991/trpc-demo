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
  userPageList: publicProcedure
    .input(
      z.object({
        page: z.number().positive().default(1),
        limit: z.number().positive().default(10),
      })
    )
    .query(async ({ input }) => {
      const [users, meta] = await db.user.paginate().withPages({
        page: input.page,
        limit: input.limit,
      });
      return [users, meta];
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// Serving
const server = createHTTPServer({ router: appRouter });
server.listen(3000);
