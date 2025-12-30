
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const data = await response.json();
            login(data.access_token);
            navigate('/admin/resources'); // Redirect to admin area after login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', width: '100%', maxWidth: '400px', border: '1px solid #e5e7eb' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#1f2937' }}>Acceso Administrativo</h1>

                {error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Usuario</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', insetY: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                <User size={18} color="#9ca3af" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', insetY: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                <Lock size={18} color="#9ca3af" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', fontWeight: '500', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}
