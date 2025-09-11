/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/404"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to default page
 * @type {string[]}
 */
export const authRoutes = ["/login"];