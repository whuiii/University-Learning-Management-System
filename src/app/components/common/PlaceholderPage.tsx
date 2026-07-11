import { useLocation } from 'react-router-dom';
import { serif } from '../../utils/helpers';

export function PlaceholderPage() {
  const location = useLocation();
  const title = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h1 className="text-4xl font-light mb-4" style={{ fontFamily: serif }}>
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </h1>
      <p className="text-muted-foreground max-w-md">
        This page is under construction. Check back soon for this feature.
      </p>
      <div className="mt-8 w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center text-5xl">
        🚧
      </div>
    </div>
  );
}