"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { Textarea } from "@/components/ui/Input";
import { PROMPT_QUESTIONS } from "@/lib/demo-data";
import { StepNav } from "./StepNav";
import stepStyles from "./StepShell.module.css";
import styles from "./StepPrompts.module.css";

const REQUIRED = 3;
const ANSWER_MAX = 300;

export interface PromptValue {
  question: string;
  answer: string;
}

interface StepPromptsProps {
  defaultValue: PromptValue[];
  onNext: (prompts: PromptValue[]) => void;
  onBack: () => void;
}

export function StepPrompts({ defaultValue, onNext, onBack }: StepPromptsProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue.map((p) => p.question));
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(defaultValue.map((p) => [p.question, p.answer])),
  );

  const toggleQuestion = (question: string) => {
    setSelected((prev) => {
      if (prev.includes(question)) return prev.filter((q) => q !== question);
      if (prev.length >= REQUIRED) return prev;
      return [...prev, question];
    });
  };

  const setAnswer = (question: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const isValid =
    selected.length === REQUIRED &&
    selected.every((q) => {
      const answer = (answers[q] ?? "").trim();
      return answer.length > 0 && answer.length <= ANSWER_MAX;
    });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    onNext(selected.map((question) => ({ question, answer: (answers[question] ?? "").trim() })));
  };

  return (
    <div className={stepStyles.wrap}>
      <p className={stepStyles.eyebrow}>Step 6 of 7</p>
      <h1 className={stepStyles.title}>Profile Prompts</h1>
      <p className={stepStyles.subtitle}>Choose 3 prompts and answer them — this is where your personality shows.</p>
      <form className={stepStyles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.counter} data-met={selected.length === REQUIRED}>
          {selected.length} of {REQUIRED} prompts chosen
        </p>
        <div className={styles.picker} role="group" aria-label="Prompt questions">
          {PROMPT_QUESTIONS.map((question) => (
            <Chip
              key={question}
              selected={selected.includes(question)}
              onClick={() => toggleQuestion(question)}
              disabled={!selected.includes(question) && selected.length >= REQUIRED}
            >
              {question}
            </Chip>
          ))}
        </div>

        {selected.length > 0 && (
          <div className={styles.answerList}>
            {selected.map((question) => {
              const answer = answers[question] ?? "";
              return (
                <div key={question} className={styles.answerCard}>
                  <p className={styles.answerQuestion}>{question}</p>
                  <Textarea
                    aria-label={`Answer for: ${question}`}
                    rows={3}
                    maxLength={ANSWER_MAX}
                    value={answer}
                    onChange={(e) => setAnswer(question, e.target.value)}
                    placeholder="Type your answer…"
                  />
                  <p className={stepStyles.charCount} data-over={answer.length > ANSWER_MAX}>
                    {answer.length}/{ANSWER_MAX}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <StepNav onBack={onBack} continueDisabled={!isValid} />
      </form>
    </div>
  );
}
