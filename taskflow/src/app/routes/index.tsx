import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useContext, type ReactNode } from 'react';

import { AuthContext } from '../../features/auth/auth-context';
import { APP_CONSTANTS } from '../../shared/constants/app';

import LoginPage from '../../pages/login';
import DashboardPage from '../../pages/dashboard';
import TasksPage from '../../pages/tasks';
import NotFoundPage from '../../pages/not-found';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={APP_CONSTANTS.ROUTES.DASHBOARD} replace />,
  },
  {
    path: APP_CONSTANTS.ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: APP_CONSTANTS.ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_CONSTANTS.ROUTES.TASKS,
    element: (
      <ProtectedRoute>
        <TasksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_CONSTANTS.ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
