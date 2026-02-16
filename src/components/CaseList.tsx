"use client";

import { motion } from 'framer-motion';
import { cases, Case } from '@/data/cases';
import { ArrowLeft, Clock } from 'lucide-react';

interface CaseListProps {
    professionId: string;
    onSelect: (c: Case) => void;
    onBack: () => void;
}

export const CaseList = ({ professionId, onSelect, onBack }: CaseListProps) => {
    const filteredCases = cases.filter(c => c.profession === professionId);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-5 h-5" /> Назад к выбору направления
            </button>

            <h2 className="text-3xl font-bold mb-8">Доступные кейсы</h2>

            <div className="space-y-4">
                {filteredCases.map((c, index) => (
                    <motion.button
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(c)}
                        className="w-full glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors text-left group"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 ${c.difficulty === 'Junior' ? 'text-green-400' :
                                        c.difficulty === 'Middle' ? 'text-blue-400' : 'text-purple-400'
                                    }`}>
                                    {c.difficulty}
                                </span>
                                <div className="flex items-center gap-1 text-zinc-500 text-xs">
                                    <Clock className="w-3 h-3" /> 15-30 мин
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                        </div>
                        <div className="shrink-0">
                            <span className="text-primary font-medium flex items-center gap-2">
                                Решить <ArrowLeft className="w-4 h-4 rotate-180" />
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
