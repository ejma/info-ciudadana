import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AgendaPage } from './pages/AgendaPage';
import { ParliamentPage } from './pages/ParliamentPage';
import { LegislaturePage } from './pages/LegislaturePage';
import { SubsidiesPage } from './pages/SubsidiesPage';
import { ContractingPage } from './pages/ContractingPage';
import { LegislationPage } from './pages/LegislationPage';
import { AlertsPage } from './pages/AlertsPage';
import { CorruptionPage } from './pages/CorruptionPage';
import { ParticipationPage } from './pages/ParticipationPage';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <AgendaPage />,
            },
            {
                path: "parliament",
                element: <ParliamentPage />,
            },
            {
                path: "legislature",
                element: <LegislaturePage />,
            },
            {
                path: "subsidies",
                element: <SubsidiesPage />,
            },
            {
                path: "contracting",
                element: <ContractingPage />,
            },
            {
                path: "legislation",
                element: <LegislationPage />,
            },
            {
                path: "alerts",
                element: <AlertsPage />,
            },
            {
                path: "corruption",
                element: <CorruptionPage />,
            },
            {
                path: "participation",
                element: <ParticipationPage />,
            },
        ],
    },
]);
