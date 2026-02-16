"use client";

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, Cpu, LineChart, Briefcase } from 'lucide-react';

interface LandingHeroProps {
    onStart: () => void;
}

export const LandingHero = ({ onStart }: LandingHeroProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
                    <Cpu className="w-4 h-4" />
                    <span>AI-Powered Evaluation</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    Станьте Лидером <br />в Аналитике
                </h1>
                <p className="max-w-2xl text-lg text-zinc-400 mb-10 leading-relaxed">
                    Проверьте свои навыки на реальных бизнес-кейсах. Получите мгновенную обратную связь от ИИ-ментора уровня Senior.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={onStart}
                        className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        Начать практику <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 bg-muted hover:bg-muted/80 text-white rounded-xl font-medium border border-border transition-all">
                        Узнать больше
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-24 opacity-50 grayscale shadow-inner">
                <div className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> Business</div>
                <div className="flex items-center gap-2"><Cpu className="w-5 h-5" /> System</div>
                <div className="flex items-center gap-2"><LineChart className="w-5 h-5" /> Financial</div>
                <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Product</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Risk</div>
            </div>
        </div>
    );
};
