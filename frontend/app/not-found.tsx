import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
 return (
 <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-50 dark:bg-zinc-900">
 <div className="flex max-w-[420px] flex-col items-center justify-center text-center">
 <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-blue-900/20">
 <FileQuestion className="h-12 w-12 text-primary dark:text-blue-400" />
 </div>

 <h1 className="h1 mb-4 text-4xl font-bold tracking-tight text-card-foreground dark:text-gray-50">
 Page not found
 </h1>

 <p className="mb-8 text-base text-muted-foreground">
 Sorry, we couldn't find the page you're looking for. It might have
 been removed, renamed, or doesn't exist.
 </p>

 <Link
 href="/dashboard"
 className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary dark:hover:bg-primary-hover dark:focus:ring-offset-zinc-900"
 >
 <Home className="h-4 w-4" />
 Back to Dashboard
 </Link>
 </div>
 </div>
 );
}
