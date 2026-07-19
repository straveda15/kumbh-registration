import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
    <Compass className="size-10 text-muted-foreground" />
    <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
    <p className="text-sm text-muted-foreground">
      The page you're looking for doesn't exist or may have moved.
    </p>
    <Button asChild>
      <Link to="/">Back to home</Link>
    </Button>
  </div>
);

export default NotFoundPage;
