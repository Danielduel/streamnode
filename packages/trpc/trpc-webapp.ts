// @deno-types="npm:@trpc/client"
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { isLocal } from "@/packages/utils/envrionment.ts";
import { AppRouter } from "@/packages/trpc/router.ts";

const getUrl = (internal: boolean) =>
  internal
    ? "/api/trpc"
    : isLocal()
    ? "http://localhost:8081/api/trpc"
    : "https://tower-of-tech-editor.deno.dev/api/trpc";

export const createClient = (internal: boolean) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getUrl(internal),
        maxURLLength: 50 * 1000,
        // You can pass any HTTP headers you wish here
        // async headers() {
        //   return {
        //     authorization: getAuthCookie(),
        //   };
        // },
      }),
    ],
  });

export const webappTrpc = createClient(true);
