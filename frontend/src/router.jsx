import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AgendaPage } from './pages/AgendaPage';
import { ParliamentPage } from './pages/ParliamentPage';
import { LegislaturePage } from './pages/LegislaturePage';
import { GovernmentPage } from './pages/GovernmentPage';
import { ParticipacionPage } from './pages/ParticipacionPage';
import { ParticipacionDetail } from './pages/ParticipacionDetail';
import { LoginPage } from './pages/LoginPage';
import { AdminResourcePage } from './pages/admin/AdminResourcePage';
import { AuthProvider } from './context/AuthContext';

// Wrapper to provide Context
const AppWrapper = () => (
    <AuthProvider>
        <Outlet />
    </AuthProvider>
);

export const router = createBrowserRouter([
    {
        element: <AppWrapper />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/agenda" replace />
                    },
                    {
                        path: "agenda",
                        element: <AgendaPage />
                    },
                    {
                        path: "congreso",
                        element: <ParliamentPage />
                    },
                    {
                        path: "legislatura",
                        element: <LegislaturePage />
                    },
                    {
                        path: "gobierno",
                        element: <GovernmentPage />
                    },
                    {
                        path: "participacion",
                        element: <ParticipacionPage />
                    },
                    {
                        path: "participacion/:slug",
                        element: <ParticipacionDetail />
                    },
                    {
                        path: "login",
                        element: <LoginPage />
                    },
                    {
                        path: "admin/resources",
                        element: <AdminResourcePage />
                    }
                ]
            }
        ]
    }
]);
