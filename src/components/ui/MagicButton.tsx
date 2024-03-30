import { cn } from "@/lib/utils";
import { ButtonProps } from "./Button";

export default function MagicButton({ children, className }: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex overflow-hidden rounded-full p-[2px]",
        className,
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background/80 px-3 py-1 text-foreground backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
}
