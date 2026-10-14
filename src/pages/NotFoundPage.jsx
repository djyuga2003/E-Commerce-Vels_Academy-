import { Link } from 'react-router';
import EmptyState from '../components/EmptyState';
import { SearchIcon } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <div className="page">
      <EmptyState
        headingLevel={1}
        icon={<SearchIcon size={30} />}
        title="Page not found"
        action={
          <Link to="/" className="btn btn--primary">
            Back to the shop
          </Link>
        }
      >
        The page you’re looking for doesn’t exist or may have moved.
      </EmptyState>
    </div>
  );
}
