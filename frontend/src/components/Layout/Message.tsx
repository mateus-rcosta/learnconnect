// Message.tsx
import clsx from "clsx";

export const Message: React.FC<{
  children: React.ReactNode;
  variant?: "info" | "error";
  className?: string;
}> = ({ children, variant = "info", className }) => (
  <div
    className={clsx(
      "px-4 py-3 rounded text-center max-w-md mx-auto",
      variant === "info"  && "bg-[#1a1a1a] text-gray-300",
      variant === "error" && "bg-red-800/30 text-red-300",
      className
    )}
  >
    {children}
  </div>
);
