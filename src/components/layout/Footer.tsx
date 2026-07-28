import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-primary text-white pt-20 pb-10">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Intro */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Image src="/logo.png" alt="AABP Logo" width={48} height={48} className="object-contain bg-white rounded-full p-0.5" />
              </div>
              <span className="font-serif font-bold text-3xl tracking-tighter text-white">
                AABP
              </span>
            </Link>
            <p className="text-white/70 leading-relaxed text-sm">
              {t('description')}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://uk.linkedin.com/company/association-of-azerbaijani-british-professionals" target="_blank" rel="noopener noreferrer" aria-label="AABP on LinkedIn" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a href="https://instagram.com/aabporg_uk" target="_blank" rel="noopener noreferrer" aria-label="AABP on Instagram" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/p/Association-of-Azerbaijani-British-Professionals-61565702764153/" target="_blank" rel="noopener noreferrer" aria-label="AABP on Facebook" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white font-serif">{t('platform')}</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-accent transition-colors">
                  {t('research')}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-accent transition-colors">
                  {t('events')}
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-accent transition-colors">
                  {t('network')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white font-serif">{t('membership')}</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  {t('portal')}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-accent transition-colors">
                  {t('apply')}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-accent transition-colors">
                  {t('upcoming')}
                </Link>
              </li>
              <li>
                <a href={`mailto:${t('email')}`} className="hover:text-accent transition-colors">
                  {t('contactSupport')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white font-serif">{t('contact')}</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>{t('location')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>{t('email')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>{t('phone')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-sm text-white/50">
          <p className="text-center md:text-left order-2 md:order-1">{t('rights', { year })}</p>
          <p className="text-center text-white/30 text-xs order-1 md:order-2">
            Developed with dedication by{' '}
            <a href="https://www.instagram.com/huseyntahirov_/" target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-caveat)] text-accent/70 hover:text-accent transition-colors text-lg">
              Hüseyn Tahirov
            </a>
          </p>
          <div className="flex items-center justify-center md:justify-end gap-6 order-3">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
