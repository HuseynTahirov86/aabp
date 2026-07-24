"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Section, SectionHeader } from "@/components/shared/Section";
import { CommitteeCard } from "@/components/shared/cards/CommitteeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowLeft, Filter } from "lucide-react";
import { getPublicUsers, AABPUser } from "@/lib/firebase/db-users";
import { useAuth } from "@/lib/firebase/useAuth";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

export default function MyNetworkPage() {
  const t = useTranslations('Dashboard');
  const tNet = useTranslations('Network');
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [users, setUsers] = useState<AABPUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        const data = await getPublicUsers();
        // Optionally exclude self
        setUsers(data.filter(u => u.id !== user.uid));
        setIsLoading(false);
      };
      fetchUsers();
    }
  }, [user]);

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const prof = (u.profession || "").toLowerCase();
    const inst = (u.institution || "").toLowerCase();
    const country = (u.country || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = fullName.includes(query) || prof.includes(query) || inst.includes(query);
    const matchesCountry = countryFilter ? country.includes(countryFilter.toLowerCase()) : true;
    const matchesProf = professionFilter ? prof.includes(professionFilter.toLowerCase()) : true;

    return matchesSearch && matchesCountry && matchesProf;
  });

  return (
    <main className="min-h-screen bg-secondary/20 pt-8 pb-12">
      <Section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToDashboard')}
          </Link>
          
          <SectionHeader
            title={t('myNetworkTitle')}
            subtitle={tNet('title')}
          />

          <div className="mb-12 bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('myNetworkSearchPlaceholder')}
                  className="pl-12 h-12 bg-secondary/30"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-12 px-6"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" /> {t('filters')}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('countryLabel')}</label>
                  <Input
                    placeholder={t('countryPlaceholder')}
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('professionLabel')}</label>
                  <Input
                    placeholder={t('professionPlaceholder')}
                    value={professionFilter}
                    onChange={(e) => setProfessionFilter(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <p className="text-xl text-muted-foreground">{tNet('noMembers') || "No members found matching your criteria."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredUsers.map((u, i) => (
                <CommitteeCard 
                  key={u.id}
                  name={`${u.firstName} ${u.lastName}`}
                  role={u.profession || "Member"}
                  bio={u.bio || ""}
                  email={u.email}
                  linkedinUrl={u.linkedin}
                  imageUrl={u.photoUrl}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
