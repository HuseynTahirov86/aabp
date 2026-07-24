"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/shared/Hero";
import { Section } from "@/components/shared/Section";
import { CommitteeCard } from "@/components/shared/cards/CommitteeCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { getPublicUsers, AABPUser } from "@/lib/firebase/db-users";
import { useTranslations } from 'next-intl';

export function NetworkClient() {
    const t = useTranslations('Network');
    const [users, setUsers] = useState<AABPUser[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getPublicUsers();
            setUsers(data);
            setIsLoading(false);
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
        const query = normalizeStr(search);
        return fullName.includes(query) || prof.includes(query);
    });

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Hero
                title={t('title')}
                subtitle={t('subtitle')}
                backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            />
            <Section className="bg-secondary/10 pt-10 pb-24">
                <div className="max-w-4xl mx-auto mb-16 bg-card p-4 rounded-2xl shadow-glass">
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
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">{t('noMembers')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredUsers.map((user, i) => (
                            <CommitteeCard
                                key={user.id}
                                name={`${user.firstName} ${user.lastName}`}
                                role={user.profession || "Member"}
                                bio={user.bio || ""}
                                email={user.email}
                                linkedinUrl={user.linkedin}
                                index={i}
                            />
                        ))}
                    </div>
                )}
            </Section>
        </main>
    );
}
