
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { fetchResource } from '../services';

export function ParticipacionDetail() {
    const { slug } = useParams();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResource();
    }, [slug]);

    const loadResource = async () => {
        try {
            setLoading(true);
            const data = await fetchResource(slug);
            setResource(data);
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

    if (error) return (
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                Error: {error}
            </div>
            <Link to="/participacion" style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Volver a Participación
            </Link>
        </div>
    );

    if (!resource) return <div>Recurso no encontrado.</div>;

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem 1rem 4rem 1rem' }}>
            <Link
                to="/participacion"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#6b7280',
                    textDecoration: 'none',
                    marginBottom: '2rem',
                    fontWeight: '500'
                }}
            >
                <ArrowLeft size={16} />
                Volver
            </Link>

            <article>
                {resource.image_url && (
                    <img
                        src={resource.image_url}
                        alt=""
                        style={{
                            width: '100%',
                            height: '24rem',
                            objectFit: 'cover',
                            borderRadius: '1rem',
                            marginBottom: '2rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                )}

                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', lineHeight: '1.2', marginBottom: '1rem' }}>
                    {resource.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '2rem' }}>
                    <Calendar size={18} />
                    <span>{resource.published_at}</span>
                </div>

                <div
                    className="prose"
                    style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#374151' }}
                    dangerouslySetInnerHTML={{ __html: resource.content }}
                />
            </article>
        </div>
    );
}
