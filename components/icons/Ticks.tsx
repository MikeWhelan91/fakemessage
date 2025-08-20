export function SingleTick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}><path fill="currentColor" d="M9.5 17.2 3.8 11.5l1.4-1.4 4.3 4.3L19 5.9l1.4 1.4z"/></svg>
  );
}
export function DoubleTick({ className, blue = false }: { className?: string; blue?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <path fill={blue ? '#34B7F1' : '#8899a6'} d="M11.4 22.6 4.7 15.9l1.4-1.4 5.3 5.3 1.4 1.4z"/>
      <path fill={blue ? '#34B7F1' : '#8899a6'} d="M14.6 22.6 7.9 15.9l1.4-1.4 5.3 5.3L26.6 7.8l1.4 1.4z"/>
    </svg>
  );
}
