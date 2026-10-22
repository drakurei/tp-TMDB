// Skeleton posters shown while TMDB answers
export function GridSkeleton({ count = 12 }) {
  return (
    <ul className="grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="skeleton-card">
          <div className="skeleton skeleton--poster" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line skeleton--short" />
        </li>
      ))}
    </ul>
  );
}

export function StatusMessage({ title, children, action }) {
  return (
    <div className="status" role="status">
      <p className="status__title">{title}</p>
      {children && <p className="status__text">{children}</p>}
      {action}
    </div>
  );
}
