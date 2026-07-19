import { AppLayout } from '@/layouts/AppLayout';
import { AppRouter } from '@/routes/AppRouter';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </ErrorBoundary>
  );
}

export default App;
