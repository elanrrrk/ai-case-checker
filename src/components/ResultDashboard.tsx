"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, TrendingUp, Target, Award, ArrowLeft } from 'lucide-react';

export interface EvaluationResult {
    score: number;
    criteria: {
        logic: number;
        depth: number;
        practicality: number;
    };
    verdict: string;
    errors: string[];
    missing_points: string[];
    recommendation: string;
    ideal_concepts: string[];
}

interface ResultDashboardProps {
    result: EvaluationResult;
    onBack: () => void;
}

export const ResultDashboard = ({ result, onBack }: ResultDashboardProps) => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-5 h-5" /> К кейсу
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Main Score */}
                <div className="md:col-span-1 glass-card p-10 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="w-24 h-24" />
                    </div>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                initial={{ strokeDashoffset: 364.4 }}
                                animate={{ strokeDashoffset: 364.4 - (364.4 * result.score) / 10 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-primary"
                            />
                        </svg>
                        <span className="absolute text-4xl font-bold">{result.score}<span className="text-sm text-zinc-500">/10</span></span>
                    </div>
                    <p className="mt-6 font-semibold text-lg">Итоговый балл</p>
                    <p className="text-sm text-zinc-500 text-center mt-2">{result.verdict}</p>
                </div>

                {/* Criteria Breakdown */}
                <div className="md:col-span-2 glass-card p-8 space-y-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> По критериям
                    </h3>
                    {[
                        { label: 'Логика', value: result.criteria.logic, icon: Target },
                        { label: 'Глубина', value: result.criteria.depth, icon: Sparkles },
                        { label: 'Практичность', value: result.criteria.practicality, icon: CheckCircle2 },
                    ].map((item, i) => (
                        <div key={item.label} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">{item.label}</span>
                                <span className="font-medium">{item.value}/10</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value * 10}%` }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Errors / Missing */}
                <div className="space-y-6">
                    <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-xl">
                        <h4 className="flex items-center gap-2 text-red-400 font-semibold mb-4">
                            <AlertCircle className="w-5 h-5" /> Что можно улучшить
                        </h4>
                        <ul className="space-y-3">
                            {result.errors.map((error, i) => (
                                <li key={i} className="text-sm text-zinc-400 flex gap-3">
                                    <span className="text-red-500 mt-1">•</span> {error}
                                </li>
                            ))}
                            {result.missing_points.map((point, i) => (
                                <li key={i} className="text-sm text-zinc-400 flex gap-3">
                                    <span className="text-orange-500 mt-1">•</span> {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Recommendation & Concepts */}
                <div className="space-y-6">
                    <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-xl text-zinc-300">
                        <h4 className="flex items-center gap-2 text-green-400 font-semibold mb-3">
                            <CheckCircle2 className="w-5 h-5" /> Как получить 10/10
                        </h4>
                        <p className="text-sm leading-relaxed">{result.recommendation}</p>
                    </div>

                    <div className="p-6 rounded-xl border border-white/5 bg-white/2">
                        <h4 className="text-sm font-semibold mb-4 text-zinc-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Ключевые термины
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {result.ideal_concepts.map((concept, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400">
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for importing Sparkles in this file context if not globally available
import { Sparkles } from 'lucide-react';
