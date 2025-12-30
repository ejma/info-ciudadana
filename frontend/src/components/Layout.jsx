import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
    Calendar,
    Landmark,
    BarChart3,
    Coins,
    Briefcase,
    Search,
    Bell,
    AlertTriangle,
    Users
} from 'lucide-react';

export const Layout = () => {
    const navItems = [
        { path: '/', icon: <Calendar size={20} />, label: 'Agenda Gobierno' },
        { path: '/parliament', icon: <Landmark size={20} />, label: 'Parlamento' },
        { path: '/legislature', icon: <BarChart3 size={20} />, label: 'Análisis' },
        { path: '/subsidies', icon: <Coins size={20} />, label: 'Subvenciones' },
        { path: '/contracting', icon: <Briefcase size={20} />, label: 'Contratación' },
        { path: '/legislation', icon: <Search size={20} />, label: 'Buscador' },
        { path: '/alerts', icon: <Bell size={20} />, label: 'Alertas' },
        { path: '/corruption', icon: <AlertTriangle size={20} />, label: 'Corrupción' },
        { path: '/participation', icon: <Users size={20} />, label: 'Participación' },
    ];

    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '250px', background: '#f5f5f5', padding: '1rem', borderRight: '1px solid #ddd' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Ciudadano Informado</h2>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        textDecoration: 'none',
                                        color: '#333',
                                        padding: '8px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};
