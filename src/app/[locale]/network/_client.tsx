"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/shared/Hero";
import { Section } from "@/components/shared/Section";
import { CommitteeCard } from "@/components/shared/cards/CommitteeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, AlertTriangle, Filter, UserPlus } from "lucide-react";
import { getPublicUsers, AABPUser } from "@/lib/firebase/db-users";
import { sendConnectionRequest } from "@/lib/firebase/db-connections";
import { getAuthInstance } from "@/lib/firebase/config";
import { useTranslations } from 'next-intl';
import { toast } from "sonner";

export function NetworkClient() {
    const t = useTranslations('Network');
    const [users, setUsers] = useState<AABPUser[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({ profession: "", country: "", institution: "" });
    const [showFilters, setShowFilters] = useState(false);
    const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getPublicUsers();
                setUsers(data);
            } catch {
                setError("Failed to load data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const normalizeStr = (str: string) => {
        return str.toLowerCase()
            .replace(/ə/g, "e")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ç/g, "c")
            .replace(/ğ/g, "g");
    };

    const filteredUsers = users.filter(user => {
        const fullName = normalizeStr(`${user.firstName} ${user.lastName}`);
        const prof = normalizeStr(user.profession || "");
        const country = normalizeStr(user.country || "");
        const institution = normalizeStr(user.institution || "");
        const query = normalizeStr(search);

        const matchesSearch = fullName.includes(query) || prof.includes(query);
        const matchesProfession = filters.profession ? prof.includes(normalizeStr(filters.profession)) : true;
        const matchesCountry = filters.country ? country.includes(normalizeStr(filters.country)) : true;
        const matchesInstitution = filters.institution ? institution.includes(normalizeStr(filters.institution)) : true;

        return matchesSearch && matchesProfession && matchesCountry && matchesInstitution;
    });

    const handleConnect = async (userId: string) => {
        const currentUser = getAuthInstance().currentUser;
        if (!currentUser) {
            toast.error("Please sign in to connect with members.");
            return;
        }
        if (currentUser.uid === userId) {
            toast.error("You cannot connect with yourself.");
            return;
        }

        setConnectingIds(prev => new Set(prev).add(userId));
        try {
            await sendConnectionRequest(currentUser.uid, userId);
            toast.success("Connection request sent!");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to send request";
            toast.error(message);
        } finally {
            setConnectingIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Hero
                title={t('title')}
                subtitle={t('subtitle')}
                backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            />
            <Section className="bg-secondary/10 pt-10 pb-24">
                <div className="max-w-4xl mx-auto mb-8 bg-card p-4 rounded-2xl shadow-glass">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            type="text"
                            placeholder={t('search')}
                            className="pl-12 h-14 rounded-xl border-border bg-muted/30 focus-visible:ring-accent text-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4 mr-2" /> Filters
                        </Button>
                    </div>
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Profession</label>
                                <Input
                                    placeholder="e.g. Engineer"
                                    value={filters.profession}
                                    onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Country</label>
                                <Input
                                    placeholder="e.g. Azerbaijan"
                                    value={filters.country}
                                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Institution</label>
                                <Input
                                    placeholder="e.g. University"
                                    value={filters.institution}
                                    onChange={(e) => setFilters({ ...filters, institution: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">{t('noMembers')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredUsers.map((user, i) => (
                            <div key={user.id} className="relative">
                                <CommitteeCard
                                    key={user.id}
                                    name={`${user.firstName} ${user.lastName}`}
                                    role={user.profession || "Member"}
                                    bio={user.bio || ""}
                                    email={user.email}
                                    linkedinUrl={user.linkedin}
                                    index={i}
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="absolute top-4 right-4 rounded-full w-9 h-9 p-0"
                                    onClick={() => handleConnect(user.id)}
                                    disabled={connectingIds.has(user.id)}
                                    title="Send connection request"
                                >
                                    {connectingIds.has(user.id) ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <UserPlus className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Section>
        </main>
    );
}
