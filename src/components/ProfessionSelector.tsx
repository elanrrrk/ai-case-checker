"use client";

import { motion } from 'framer-motion';
import { professions } from '@/data/cases';
import { Briefcase, Cpu, LineChart, BarChart3, ShieldCheck, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    Business: Briefcase,
    System: Cpu,
    Financial: LineChart,
    Product: BarChart3,
    Risk: ShieldCheck,
};

interface ProfessionSelectorProps {
    onSelect: (id: string) => void;
}

export const ProfessionSelector = ({ onSelect }: ProfessionSelectorProps) => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Выберите направление</h2>
                <p className="text-zinc-400">Выберите область аналитики, в которой хотите пройти проверку</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {professions.map((prof, index) => {
                    const Icon = iconMap[prof.id];
                    return (
                        <motion.button
                            key={prof.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelect(prof.id)}
                            className="glass-card hover:bg-white/10 p-8 flex flex-col items-center gap-4 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                            <span className="font-semibold text-center">{prof.title}</span>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">5 кейсов</div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
