import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
import { authMiddleware } from '@clerk/nextjs/server';


export default authMiddleware({});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
};
