import { Component } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

// React error boundaries must be class components — there is no hooks
// equivalent. Catches render-time crashes anywhere in the app so a bug
// shows a recoverable message instead of a blank page.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
          <TriangleAlert className="size-8 text-destructive" />
          <p className="text-base font-medium text-foreground">Something went wrong</p>
          <p className="text-sm text-muted-foreground">
            Please reload the page. If the problem continues, your progress is safely saved on the
            server.
          </p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
