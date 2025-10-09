// import { Session, GraphqlClient } from "@shopify/shopify-api";
// import { sessionStorage } from "../shopify.server";
// import prisma from "../db.server";

// /**
//  * Main session manager for both web and background jobs
//  * Handles online/offline tokens and session validation
//  */
// export async function getValidSession(shop: string): Promise<Session | null> {
//   try {
//     // Try different session ID formats
//     const sessionIds = [
//       `offline_${shop}`,  // Offline token ID
//       shop,               // Online token ID
//     ];
    
//     let session = null;
    
//     // Try each possible session ID format
//     for (const sessionId of sessionIds) {
//       session = await sessionStorage.loadSession(sessionId);
//       if (session) {
//         break;
//       }
//     }
    
//     // If no session found by ID, try finding by shop
//     if (!session) {
//       const sessions = await sessionStorage.findSessionsByShop(shop);
//       if (sessions && sessions.length > 0) {
//         session = sessions[0];
//       }
//     }
    
//     if (!session) {
//       return null;
//     }

//     // Check if session is still valid (only for online tokens)
//     if (session.expires && new Date() > session.expires) {
//       return null;
//     }

//     if (!session.accessToken) {
//       return null;
//     }
    
//     return session;
    
//   } catch (error) {
//     return null;
//   }
// }

// /**
//  * Fallback: Get offline session from database storage
//  * Used when session storage doesn't have the session
//  */
// export async function getOfflineSession(shop: string): Promise<Session | null> {
//   try {
//     const store = await prisma.storeEmailSettings.findUnique({ where: { shop } });
//     if (!store?.accessToken) {
//       return null;
//     }

//     const session = new Session({
//       id: `offline_${shop}`,
//       shop,
//       state: "",
//       isOnline: false,
//       accessToken: store.accessToken,
//     });

//     return session;
//   } catch (error) {
//     return null;
//   }
// }

// /**
//  * Create a GraphQL client from a session
//  */
// export function createGraphqlClient(session: Session): GraphqlClient {
//   return new GraphqlClient({ session });
// }

// /**
//  * Create a background session for API calls
//  * (Legacy support - prefer getValidSession)
//  */
// export function createBackgroundSession(shop: string, accessToken: string): Session {
//   return new Session({
//     id: `offline_${shop}`,
//     shop: shop,
//     state: "offline",
//     isOnline: false,
//     accessToken: accessToken,
//     scope: process.env.SCOPES || "read_orders,read_customers,read_products",
//   });
// }
import { Session, GraphqlClient } from "@shopify/shopify-api";
import { sessionStorage } from "../shopify.server";
import prisma from "../db.server";

/**
 * Main session manager for both web and background jobs
 * Handles online/offline tokens and session validation
 */
export async function getValidSession(shop: string): Promise<Session | null> {
  try {
    // Try different session ID formats
    const sessionIds = [
      `offline_${shop}`,  // Offline token ID
      shop,               // Online token ID
    ];
    
    let session = null;
    
    // Try each possible session ID format
    for (const sessionId of sessionIds) {
      session = await sessionStorage.loadSession(sessionId);
      if (session) {
        break;
      }
    }
    
    // If no session found by ID, try finding by shop
    if (!session) {
      const sessions = await sessionStorage.findSessionsByShop(shop);
      if (sessions && sessions.length > 0) {
        session = sessions[0];
      }
    }
    
    if (!session) {
      return null;
    }

    // Check if session is still valid (only for online tokens)
    if (session.expires && new Date() > session.expires) {
      return null;
    }

    if (!session.accessToken) {
      return null;
    }
    
    return session;
    
  } catch (error) {
    console.error('Error getting valid session:', error);
    return null;
  }
}

/**
 * Fallback: Get offline session from database storage
 * Used when session storage doesn't have the session
 */
export async function getOfflineSession(shop: string): Promise<Session | null> {
  try {
    const store = await prisma.storeEmailSettings.findUnique({ where: { shop } });
    if (!store?.accessToken) {
      return null;
    }

    const session = new Session({
      id: `offline_${shop}`,
      shop,
      state: "",
      isOnline: false,
      accessToken: store.accessToken,
      scope: process.env.SCOPES || "read_orders,read_customers,read_products",
    });

    return session;
  } catch (error) {
    console.error('Error getting offline session:', error);
    return null;
  }
}

/**
 * Create a GraphQL client from a session
 */
export function createGraphqlClient(session: Session): GraphqlClient {
  return new GraphqlClient({ session });
}

/**
 * Create a background session for API calls
 */
export function createBackgroundSession(shop: string, accessToken: string): Session {
  return new Session({
    id: `offline_${shop}`,
    shop: shop,
    state: "offline",
    isOnline: false,
    accessToken: accessToken,
    scope: process.env.SCOPES || "read_orders,read_customers,read_products",
  });
}