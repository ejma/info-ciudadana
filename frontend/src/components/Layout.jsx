import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Calendar,
    Landmark,
    BarChart3,
    Coins,
    Briefcase,
    Search,
    Bell,
    AlertTriangle,
    Users,
    Building2,
    Lock,
    LogOut,
    LogIn
} from 'lucide-react';

export const Layout = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', icon: <Calendar size={20} />, label: 'Agenda Gobierno' },
        { path: '/gobierno', icon: <Building2 size={20} />, label: 'Composición Gob.' },
        { path: '/parliament', icon: <Landmark size={20} />, label: 'Parlamento' },
        { path: '/legislature', icon: <BarChart3 size={20} />, label: 'Análisis' },
        { path: '/subsidies', icon: <Coins size={20} />, label: 'Subvenciones' },
        { path: '/contracting', icon: <Briefcase size={20} />, label: 'Contratación' },
        { path: '/legislation', icon: <Search size={20} />, label: 'Buscador' },
        { path: '/alerts', icon: <Bell size={20} />, label: 'Alertas' },
        { path: '/corruption', icon: <AlertTriangle size={20} />, label: 'Corrupción' },
        { path: '/participacion', icon: <Users size={20} />, label: 'Participación' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ path: '/admin/resources', icon: <Lock size={20} />, label: 'Admin Participación' });
    }

    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '250px', background: '#f5f5f5', padding: '1rem', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Ciudadano Informado</h2>
                <nav style={{ flex: 1 }}>
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

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
                    {user ? (
                        <div style={{ padding: '0.5rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                                Hola, {user.username}
                            </div>
                            <button
                                onClick={logout}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    border: 'none', background: 'transparent',
                                    color: '#b91c1c', cursor: 'pointer', padding: 0,
                                    fontSize: '0.9rem'
                                }}
                            >
                                <LogOut size={18} /> Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                textDecoration: 'none', color: '#2563eb', padding: '0.5rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            <LogIn size={18} /> Acceso Admin
                        </Link>
                    )}
                </div>
            </aside>
            <main style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};
