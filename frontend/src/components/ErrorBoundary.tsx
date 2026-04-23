import React from 'react';

interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '2rem', background: '#0f172a', direction: 'rtl'
        }}>
          <div style={{
            background: '#1e293b', borderRadius: '1rem', padding: '2.5rem',
            maxWidth: '600px', width: '100%', border: '1px solid #334155'
          }}>
            <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>⚠️ حدث خطأ في التطبيق</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              الخطأ التالي منع الصفحة من الظهور:
            </p>
            <pre style={{
              background: '#0f172a', color: '#fca5a5', padding: '1rem',
              borderRadius: '0.5rem', fontSize: '0.85rem',
              overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
            }}>
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                marginTop: '1.5rem', padding: '0.75rem 1.5rem',
                background: '#FF7B9C', color: 'white', border: 'none',
                borderRadius: '9999px', cursor: 'pointer', fontWeight: '600'
              }}
            >
              المحاولة مرة أخرى
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
