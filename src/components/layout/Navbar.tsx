"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Search, Globe, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { useAuth } from "@/lib/firebase/useAuth";

// Mobile search button — triggers the same CommandPalette used on desktop
function MobileSearch() {
  const openCommandPalette = () => {
    // Trigger Ctrl+K event to open the CommandPalette
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })
    );
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white hover:bg-white/10"
      onClick={openCommandPalette}
    >
      <Search className="h-6 w-6" />
    </Button>
  );
}

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navbar');

  const changeLanguage = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
      >
        <Globe className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>{t('english')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('az')}>{t('azerbaijani')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ru')}>{t('russian')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function Navbar() {
  const t = useTranslations('Navbar');
  const tIndex = useTranslations('Index');
  
  const components = [
    {
      title: t('about'),
      href: "/about",
      description: t('aboutDesc'),
    },
    {
      title: t('leadership'),
      href: "/about/leadership",
      description: t('execCommittee'),
    },
    {
      title: t('missionVision'),
      href: "/about/mission",
      description: t('buildingBridges'),
    },
    {
      title: t('research'),
      href: "/research",
      description: t('researchDesc'),
    },
    {
      title: t('events'),
      href: "/events",
      description: t('eventsDesc'),
    },
    {
      title: t('media'),
      href: "/media",
      description: t('mediaDesc'),
    },
    {
      title: t('career'),
      href: "/career",
      description: t('careerDesc'),
    },
  ];

  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, loading } = useAuth();


  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Official Top Bar */}
      <div className="w-full bg-[#0B1524] text-white/80 py-1.5 px-6 text-xs font-medium border-b border-white/10 hidden lg:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            <span>{t('officialWebsite')}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:contact@aabporg.uk" className="hover:text-white transition-colors">contact@aabporg.uk</a>
            <span className="opacity-50">|</span>
            <a href="tel:+447454776856" className="hover:text-white transition-colors">+44 7454 776856</a>
          </div>
        </div>
      </div>

      {/* Top Tier: Hidden when scrolled */}
      <div
        className={cn(
          "w-full bg-card transition-all duration-300 overflow-hidden hidden lg:block border-b border-border shadow-sm",
          isScrolled ? "h-0 opacity-0" : "h-[60px] opacity-100"
        )}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <Image src="/logo.png" alt="AABP Logo" width={38} height={38} className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-tighter text-accent leading-tight">
                AABP
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.15em] mt-0.5">
                Association of Azerbaijan British Professionals
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <span className="italic font-serif text-base text-foreground/70">
              {tIndex('empoweringTitle')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Sticky Navbar */}
      <div className={cn(
        "w-full transition-all duration-300",
        isScrolled
          ? "bg-primary shadow-md py-2.5"
          : "bg-primary py-3 shadow-md"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* Logo in Bottom Tier (Visible on mobile, or when scrolled on desktop) */}
          <div className={cn(
            "flex items-center transition-all duration-300 overflow-hidden",
            isScrolled ? "lg:w-auto lg:opacity-100 lg:mr-8" : "lg:w-0 lg:opacity-0 lg:mr-0",
            "w-auto opacity-100 mr-4" // Always visible on mobile
          )}>
            <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
              <div className={cn(
                "flex items-center justify-center lg:hidden",
                isScrolled && "lg:flex"
              )}>
                <Image src="/logo.png" alt="AABP Logo" width={40} height={40} className="object-contain" priority />
              </div>
              <span className={cn(
                "font-serif font-bold text-xl tracking-tighter text-white lg:hidden",
                isScrolled && "lg:block"
              )}>
                AABP
              </span>
            </Link>
          </div>

          {/* Desktop Nav (Mega Menu) */}
          <div className="hidden lg:flex items-center gap-6 w-full">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:bg-white/10 text-white data-[state=open]:bg-white/10 data-[state=open]:text-white hover:text-white"
                  >
                    {t('discover')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-card">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/network"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-white/10 text-white hover:text-white focus:bg-white/10 focus:text-white"
                    )}
                  >
                    {t('memberDirectory')}
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Language */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto">
              <CommandPalette />
              <Link href={user ? "/dashboard" : "/login"}>
                <Button
                  className="rounded-full px-6 font-medium shadow-sm transition-all bg-accent text-white hover:bg-accent/90"
                  disabled={loading}
                >
                  {loading ? "..." : user ? t('dashboard') : t('signIn')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="flex lg:hidden items-center gap-2">
            <MobileSearch />
            <LanguageSwitcher />
            <Sheet>
              <SheetTrigger className="p-2 inline-flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-white">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card border-border">
                <nav className="flex flex-col gap-4 mt-8">
                  {components.map((comp) => (
                    <Link
                      key={comp.href}
                      href={comp.href}
                      className="block px-2 py-1 text-lg font-medium text-foreground hover:text-accent transition-colors"
                    >
                      {comp.title}
                    </Link>
                  ))}
                  <Link
                    href="/network"
                    className="block px-2 py-1 text-lg font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {t('memberDirectory')}
                  </Link>
                  <div className="mt-8">
                    <Link href={user ? "/dashboard" : "/login"}>
                      <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-full h-12" disabled={loading}>
                        {loading ? "..." : user ? t('dashboard') : t('signIn')}
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <Link
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground",
          className
        )}
        {...props}
      >
          <div className="text-sm font-semibold leading-none text-foreground relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
            {children}
          </p>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";
