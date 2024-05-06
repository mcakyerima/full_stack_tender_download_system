"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// Define the type for the props of ConvexClientProvider
interface ConvexClientProviderProps {
  children: ReactNode;
  clerkPublishableKey: string | any;
}
// Define the Convex client instance using the provided URL from environment variables
const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Provider component for integrating Convex as the backend client.
 * It wraps the application components with ConvexProvider to enable data fetching and state management.
 * @param children - The child components to be wrapped by ConvexProvider.
 */
export default function ConvexClientProvider({
  children,
  clerkPublishableKey,
}:   ConvexClientProviderProps
) {
  // Render the ConvexProvider with the configured client and provide children components
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} >
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
  )
}
