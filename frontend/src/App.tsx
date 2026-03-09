import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { store, persistor } from './store/store';
import { AuthGuard, GuestGuard } from './guards';
import { Spinner } from './components/atoms';

// Lazy load pages for code splitting
const HomePage = lazy(() =>
  import('./components/pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const LoginPage = lazy(() =>
  import('./components/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import('./components/pages/SignupPage').then((m) => ({ default: m.SignupPage }))
);
const AdminDashboardPage = lazy(() =>
  import('./components/pages/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  }))
);
const NotFoundPage = lazy(() =>
  import('./components/pages/NotFoundPage').then((m) => ({
    default: m.NotFoundPage,
  }))
);
const QuizPage = lazy(() =>
  import('./components/pages/QuizPage').then((m) => ({
    default: m.QuizPage,
  }))
);
const NotesPage = lazy(() =>
  import('./components/pages/NotesPage').then((m) => ({
    default: m.NotesPage,
  }))
);

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <span className="text-cyber-muted text-sm font-mono">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <HelmetProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />

                {/* Auth Routes (Guest Only) */}
                <Route
                  path="/login"
                  element={
                    <GuestGuard>
                      <LoginPage />
                    </GuestGuard>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <GuestGuard>
                      <SignupPage />
                    </GuestGuard>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/quiz"
                  element={
                    <AuthGuard>
                      <QuizPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <AuthGuard>
                      <NotesPage />
                    </AuthGuard>
                  }
                />
                {/*
                <Route
                  path="/progress"
                  element={
                    <AuthGuard>
                      <ProgressPage />
                    </AuthGuard>
                  }
                />
                */}

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AuthGuard requireAdmin>
                      <AdminDashboardPage />
                    </AuthGuard>
                  }
                />
                {/* Add more admin routes as needed */}
                {/*
                <Route
                  path="/admin/domains"
                  element={
                    <AuthGuard requireAdmin>
                      <AdminDomainsPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/resources"
                  element={
                    <AuthGuard requireAdmin>
                      <AdminResourcesPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AuthGuard requireAdmin>
                      <AdminUsersPage />
                    </AuthGuard>
                  }
                />
                */}

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
