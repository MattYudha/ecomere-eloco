import * as NextAuthModule from "next-auth";
import { authOptions } from "@/utils/authOptions";

// @ts-ignore - This is a workaround for a likely bug in experimental Next.js versions
const handler = NextAuthModule.default(authOptions);

export { handler as GET, handler as POST };