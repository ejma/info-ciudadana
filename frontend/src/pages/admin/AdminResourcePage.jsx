
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Plus, Edit2, Trash2, Globe, FileText } from 'lucide-react';
import { fetchResources, createResource, updateResource, deleteResource } from '../../services';
import { ResourceEditor } from '../../components/admin/ResourceEditor';

export function AdminResourcePage() {
    const { token, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingResource, setEditingResource] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && !token) {
            navigate('/login');
        } else if (token) {
            loadResources();
        }
    }, [token, authLoading, navigate]);

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

    const handleSave = async (resourceData) => {
        try {
            if (isCreating) {
                await createResource(resourceData, token);
            } else if (editingResource) {
                await updateResource(editingResource.id, resourceData, token);
            }
            setIsCreating(false);
            setEditingResource(null);
            loadResources();
        } catch (err) {
            alert(`Error guardando recurso: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
            try {
                await deleteResource(id, token);
                loadResources();
            } catch (err) {
                alert(`Error eliminando recurso: ${err.message}`);
            }
        }
    };

    if (authLoading || (loading && resources.length === 0)) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Loader2 className="animate-spin" size={48} color="#2563eb" />
        </div>
    );

    if (isCreating || editingResource) {
        return (
            <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto' }}>
                <ResourceEditor
                    resource={editingResource}
                    onSave={handleSave}
                    onCancel={() => { setIsCreating(false); setEditingResource(null); }}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>Gestión de Participación</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.5rem', backgroundColor: '#2563eb',
                        color: 'white', border: 'none', borderRadius: '0.5rem',
                        cursor: 'pointer', fontWeight: '500'
                    }}
                >
                    <Plus size={20} /> Nuevo Artículo
                </button>
            </div>

            {error && <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem' }}>{error}</div>}

            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Título</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Slug</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Publicado</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                        {resources.map(resource => (
                            <tr key={resource.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem 1.5rem', color: '#111827', fontWeight: '500' }}>{resource.title}</td>
                                <td style={{ padding: '1rem 1.5rem', color: '#6b7280', fontFamily: 'monospace' }}>{resource.slug}</td>
                                <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{resource.published_at}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <Link to={`/participacion/${resource.slug}`} target="_blank" title="Ver en Web" style={{ padding: '0.5rem', color: '#374151' }}>
                                        <Globe size={18} />
                                    </Link>
                                    <button onClick={() => setEditingResource(resource)} title="Editar" style={{ padding: '0.5rem', color: '#2563eb', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(resource.id)} title="Eliminar" style={{ padding: '0.5rem', color: '#dc2626', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {resources.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                    No hay recursos creados aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
