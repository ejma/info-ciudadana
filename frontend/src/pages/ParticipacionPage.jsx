
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { fetchResources } from '../services';

export function ParticipacionPage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await fetchResources();
            setResources(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
            <Loader2 className="animate-spin" style={{ color: '#2563eb' }} size={48} />
        </div>
    );

    return (
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Participación Ciudadana</h1>

            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    Error: {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {resources.map(resource => (
                    <Link
                        to={`/participacion/${resource.slug}`}
                        key={resource.id}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        className="group"
                    >
                        <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            transition: 'box-shadow 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            {resource.image_url ? (
                                <img
                                    src={resource.image_url}
                                    alt={resource.title}
                                    style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '12rem', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                    Sin imagen
                                </div>
                            )}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                    {resource.published_at || 'Borrador'}
                                </div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827', lineHeight: '1.4' }}>
                                    {resource.title}
                                </h2>
                                <p style={{ color: '#4b5563', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>
                                    {resource.excerpt}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#2563eb', fontWeight: '500', gap: '0.25rem' }}>
                                    Leer más <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {resources.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No hay recursos de participación disponibles en este momento.
                </div>
            )}
        </div>
    );
}
