"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingHero } from '@/components/LandingHero';
import { ProfessionSelector } from '@/components/ProfessionSelector';
import { CaseList } from '@/components/CaseList';
import { Workspace } from '@/components/Workspace';
import { ResultDashboard, EvaluationResult } from '@/components/ResultDashboard';
import { Case } from '@/data/cases';

type Step = 'landing' | 'select-profession' | 'select-case' | 'workspace' | 'results';

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleProfessionSelect = (id: string) => {
    setSelectedProfession(id);
    setStep('select-case');
  };

  const handleCaseSelect = (c: Case) => {
    setSelectedCase(c);
    setStep('workspace');
  };

  const handleStart = () => {
    setStep('select-profession');
  };

  const handleBackToProfession = () => {
    setStep('select-profession');
  };

  const handleBackToCases = () => {
    setStep('select-case');
  };

  const handleBackToWorkspace = () => {
    setStep('workspace');
  };

  const handleSubmitSolution = async (solution: string) => {
    if (!selectedCase) return;

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: selectedCase.title,
          profession: selectedCase.profession,
          solution: solution,
          systemLogic: selectedCase.systemLogic,
          idealConcepts: selectedCase.idealConcepts
        }),
      });

      if (!response.ok) throw new Error('Failed to evaluate');

      const data = await response.json();
      setResult(data);
      setStep('results');
    } catch (error) {
      console.error(error);
      alert('Произошла ошибка при анализе решения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LandingHero onStart={handleStart} />
          </motion.div>
        )}

        {step === 'select-profession' && (
          <motion.div
            key="profession"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ProfessionSelector onSelect={handleProfessionSelect} />
          </motion.div>
        )}

        {step === 'select-case' && (
          <motion.div
            key="cases"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CaseList
              professionId={selectedProfession}
              onBack={handleBackToProfession}
              onSelect={handleCaseSelect}
            />
          </motion.div>
        )}

        {step === 'workspace' && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            {selectedCase && (
              <Workspace
                currentCase={selectedCase}
                onBack={handleBackToCases}
                onSubmit={handleSubmitSolution}
                isEvaluating={isEvaluating}
              />
            )}
          </motion.div>
        )}

        {step === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ResultDashboard
              result={result}
              onBack={handleBackToWorkspace}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
