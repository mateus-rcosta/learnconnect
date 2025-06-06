// Spinner.tsx
export const Spinner: React.FC<{size?: number}> = ({ size = 32 }) => (
  <div
    className="loader border-[#5c64f4]"
    style={{ width: size, height: size }}
  />
);
