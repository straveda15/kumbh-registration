import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import App from './App.jsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class MainDebugBoundary extends Component {
  state = { error: null, info: null };
  componentDidCatch(error, info) {
    console.error('=== REACT RUNTIME ERROR CAUGHT ===');
    console.error('Error:', error);
    console.error('Component Stack:', info?.componentStack);
    this.setState({ error, info });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, color: 'red', fontFamily: 'monospace' }}>
          <h2>React Runtime Error Caught</h2>
          <pre>{String(this.state.error?.stack || this.state.error)}</pre>
          <h3>Component Stack:</h3>
          <pre>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainDebugBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </MainDebugBoundary>
  </StrictMode>
);
