import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                GDPR Dashboard
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#"
              >
                Documentation
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search placeholder */}
            </div>
            <nav className="flex items-center">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              AI-Powered GDPR Compliance
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Simplify your data protection management with our advanced AI dashboard.
              Automate compliance, manage consents, and generate documents in seconds.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg" className="h-11 px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-11 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Antigravity.
          </p>
        </div>
      </footer>
    </div>
  );
}
