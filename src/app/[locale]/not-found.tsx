import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-serif text-[120px] md:text-[160px] font-bold leading-none text-accent/20 select-none">
          404
        </p>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4 -mt-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-accent text-white hover:bg-accent/90 rounded-full px-8 h-12 font-semibold inline-flex items-center gap-2"
          >
            Back to Home
            <Home className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="border border-border text-foreground hover:bg-card rounded-full px-8 h-12 inline-flex items-center gap-2"
          >
            About AABP
            <Search className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
