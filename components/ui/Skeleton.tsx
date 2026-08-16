import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} style={style} {...props} />;
}
