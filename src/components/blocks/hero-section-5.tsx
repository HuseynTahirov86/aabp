'use client'
import React from 'react'
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { motion } from 'framer-motion'

import { ChevronRight, Building2, Landmark, GraduationCap, Briefcase, Microscope, Globe, Atom, BookOpen } from 'lucide-react'

export function HeroSection() {
    const t = useTranslations('Index');
    return (
        <div className="overflow-x-hidden pt-12 md:pt-16 pb-12 bg-background">
            <section className="bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526431980835-263a03366c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
                
                <div className="relative py-24 md:py-32 lg:py-40">
                    <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mx-auto max-w-2xl text-center lg:ml-0 lg:max-w-3xl lg:text-left"
                        >
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="mt-8 text-balance text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight"
                            >
                                {t('title')}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                className="mt-8 max-w-2xl text-balance text-lg text-white/80 leading-relaxed"
                            >
                                {t('description')}
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                                className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
                            >
                                <Button
                                    render={<Link href="/register" />}
                                    size="lg"
                                    className="h-14 rounded-md px-8 text-lg bg-accent text-white hover:bg-accent/90 border border-accent transition-colors font-medium"
                                >
                                    <span className="text-nowrap">{t('applyMembership')}</span>
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button
                                    render={<Link href="/about" />}
                                    size="lg"
                                    variant="outline"
                                    className="h-14 rounded-md px-8 text-lg border-2 border-white/50 bg-transparent text-white hover:bg-white hover:text-primary transition-colors font-medium"
                                >
                                    <span className="text-nowrap">{t('learnAbout')}</span>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
                <section className="bg-background pb-12 pt-16">
                    <div className="group relative m-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:border-border md:pr-6 mb-6 md:mb-0">
                                <p className="text-center md:text-end text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key Disciplines & Sectors</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    durationOnHover={20}
                                    duration={40}
                                    gap={112}>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <Building2 className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Business</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <Landmark className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Institution</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <GraduationCap className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Academy</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <Briefcase className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Consulting</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <Microscope className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Research</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <Globe className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Global</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <Atom className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Science</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary/80 hover:text-accent transition-colors cursor-default">
                                        <BookOpen className="w-8 h-8" />
                                        <span className="font-bold text-lg hidden sm:block">Medicine</span>
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-gradient-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-gradient-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
        </div>
    )
}
