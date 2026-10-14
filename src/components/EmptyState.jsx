import './EmptyState.css';

export default function EmptyState({ icon, title, children, action, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;

  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <Heading className="empty-state__title">{title}</Heading>
      {children && <p className="empty-state__text">{children}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
