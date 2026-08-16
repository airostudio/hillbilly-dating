import styles from "./PromptAnswer.module.css";

interface PromptAnswerProps {
  question: string;
  answer: string;
}

export function PromptAnswer({ question, answer }: PromptAnswerProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.question}>{question}</p>
      <p className={styles.answer}>{answer}</p>
    </div>
  );
}
