import { AppRouter } from "@/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000" })],
});

async function main() {
  const userList = await trpc.userList.query();
  console.log("userList: ", userList);

  const createdUser = await trpc.userCreate.mutate({
    name: `testname-${Date.now()}`,
  });
  console.log("createdUser: ", createdUser);

  const queryUser = await trpc.userById.query(createdUser.id);
  console.log("queryUser: ", queryUser);

  const result = await trpc.userPageList.query({ page: 1, limit: 3 });
  console.log("result: ", result);
}

main();
