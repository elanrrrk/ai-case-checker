"use client";

import { useState } from 'react';
import { Case } from '@/data/cases';
import { ArrowLeft, Send, Sparkles, Upload } from 'lucide-react';

interface WorkspaceProps {
    currentCase: Case;
    onBack: () => void;
    onSubmit: (solution: string) => void;
    isEvaluating: boolean;
}

export const Workspace = ({ currentCase, onBack, onSubmit, isEvaluating }: WorkspaceProps) => {
    const [solution, setSolution] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            if (file.name.endsWith('.txt')) {
                const text = await file.text();
                setSolution((prev) => prev ? prev + '\n\n' + text : text);
            } else if (file.name.endsWith('.docx')) {
                // For .docx support we would need mammoth
                // Since npm install failed, we provide a placeholder or try to use a CDN if possible
                // For now, only .txt is fully supported until mammoth is available
                alert('Поддержка .docx требует дополнительной настройки. Пожалуйста, используйте .txt или скопируйте текст вручную.');
            } else {
                alert('Пожалуйста, выберите файл .txt или .docx');
            }
        } catch (error) {
            console.error('File upload error:', error);
            alert('Ошибка при чтении файла');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = () => {
        if (!solution.trim() || isEvaluating) return;
        onSubmit(solution);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <button
                onClick={onBack}
                disabled={isEvaluating}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 disabled:opacity-50"
            >
                <ArrowLeft className="w-5 h-5" /> К списку кейсов
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Case Info */}
                <div className="space-y-6">
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 text-primary bg-primary/5">
                                {currentCase.profession}
                            </span>
                            <span className="text-zinc-500 text-sm">• {currentCase.difficulty}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">{currentCase.title}</h1>
                        <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {currentCase.description}
                        </p>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-6">
                        <h4 className="flex items-center gap-2 text-blue-400 font-medium mb-3">
                            <Sparkles className="w-4 h-4" /> Совет от ментора
                        </h4>
                        <p className="text-sm text-zinc-400">
                            Старайтесь структурировать свой ответ. Используйте списки, выделяйте ключевые метрики и предлагайте конкретные шаги реализации.
                        </p>
                    </div>
                </div>

                {/* Editor */}
                <div className="space-y-6">
                    <div className="relative group">
                        <div className="absolute top-4 right-4 z-10">
                            <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg cursor-pointer border border-white/5 transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                {isUploading ? 'Загрузка...' : 'Загрузить файл'}
                                <input
                                    type="file"
                                    accept=".txt,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={isUploading || isEvaluating}
                                />
                            </label>
                        </div>
                        <textarea
                            value={solution}
                            onChange={(e) => setSolution(e.target.value)}
                            placeholder="Введите ваше решение здесь или загрузите файл..."
                            disabled={isEvaluating}
                            className="w-full min-h-[400px] bg-zinc-900/50 border border-border rounded-xl p-8 pt-14 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-sans text-lg leading-relaxed placeholder:text-zinc-600 focus:border-primary/50 disabled:opacity-50"
                        />
                        {isEvaluating && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <p className="text-primary font-medium shimmer px-4 py-1">Анализируем решение...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!solution.trim() || isEvaluating}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale group"
                    >
                        Отправить на оценку <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
