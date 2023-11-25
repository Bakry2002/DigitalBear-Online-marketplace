/**
 * - tRPC library
 * This Providers component will allow us to use the tRPC for all the entire front-end part of the application
 * - react-query library
 *  will allow us to use the react-query as it paly well with tRPC
 **/
"use client";

import { PropsWithChildren, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";
import { httpBatchLink } from "@trpc/client";

interface ProvidersProps {}

const Providers: React.FC<ProvidersProps> = ({
  children,
}: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient()); // Create  query client that will be used to cache data
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include", // send all cookies
            });
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
