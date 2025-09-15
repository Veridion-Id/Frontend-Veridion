import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionContainer({ children, className, id }: SectionContainerProps) {
  return (
    <div 
      id={id}
      className={cn(
        "bg-container-section border-[3px] border-custom-border rounded-3xl p-8 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
