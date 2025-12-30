
import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function ResourceEditor({ resource = null, onSave, onCancel }) {
    const [title, setTitle] = useState(resource?.title || '');
    const [slug, setSlug] = useState(resource?.slug || '');
    const [excerpt, setExcerpt] = useState(resource?.excerpt || '');
    const [content, setContent] = useState(resource?.content || '');
    const [imageUrl, setImageUrl] = useState(resource?.image_url || '');
    const [publishedAt, setPublishedAt] = useState(resource?.published_at || new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    // Auto-generate slug from title if slug is empty
    useEffect(() => {
        if (!resource && title && !slug) {
            setSlug(title
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
            );
        }
    }, [title, slug, resource]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                title,
                slug,
                excerpt,
                content,
                image_url: imageUrl,
                published_at: publishedAt
            });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid #d1d5db',
        marginTop: '0.25rem',
        marginBottom: '1rem',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151'
    };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {resource ? 'Editar Recurso' : 'Nuevo Recurso'}
            </h2>

            <div>
                <label style={labelStyle}>Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={inputStyle}
                    required
                />
            </div>

            <div>
                <label style={labelStyle}>Slug (URL amigable)</label>
                <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    style={inputStyle}
                    required
                />
            </div>

            <div>
                <label style={labelStyle}>Fecha de Publicación</label>
                <input
                    type="date"
                    value={publishedAt}
                    onChange={e => setPublishedAt(e.target.value)}
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>Imagen URL</label>
                <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    style={inputStyle}
                    placeholder="https://..."
                />
            </div>

            <div>
                <label style={labelStyle}>Resumen (Feed)</label>
                <textarea
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    style={{ ...inputStyle, height: '5rem' }}
                    required
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Contenido</label>
                <div style={{ height: '20rem', marginBottom: '3rem' }}>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        style={{ height: '100%' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}
                >
                    <X size={18} /> Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#2563eb', color: 'white', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    <Save size={18} /> {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    );
}
