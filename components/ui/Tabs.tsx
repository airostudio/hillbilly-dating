"use client";

import { useState, useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  badge?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ tabs, defaultValue, value, onValueChange }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.value);
  const active = value ?? internal;
  const groupId = useId();

  function select(v: string) {
    setInternal(v);
    onValueChange?.(v);
  }

  return (
    <div>
      <div role="tablist" aria-label="Sections" className={styles.list}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            id={`${groupId}-tab-${tab.value}`}
            aria-selected={active === tab.value}
            aria-controls={`${groupId}-panel-${tab.value}`}
            className={cn(styles.tab, active === tab.value && styles.activeTab)}
            onClick={() => select(tab.value)}
            type="button"
          >
            {tab.label}
            {tab.badge}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          role="tabpanel"
          id={`${groupId}-panel-${tab.value}`}
          aria-labelledby={`${groupId}-tab-${tab.value}`}
          hidden={active !== tab.value}
          className={styles.panel}
        >
          {active === tab.value && tab.content}
        </div>
      ))}
    </div>
  );
}
