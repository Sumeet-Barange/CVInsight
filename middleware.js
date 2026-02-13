export { default } from "next-auth/middleware";

// This tells Next.js: "Apply this protection ONLY to these paths"
export const config = { 
  matcher: ["/dashboard"] 
};