import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { default as cors, default as express } from "express";
import { z } from "zod";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return { message: `Hello ${input}` };
    }),
});

const app = express();

app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(3001, () => {
  console.log(`🚀 Server running on http://localhost:3001`);
});