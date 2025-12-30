
import React, { useEffect, useState } from 'react';
import { Loader2, X, Globe } from 'lucide-react';
import { fetchBio } from '../services';
import './BioModal.css';

export function BioModal({ member, onClose }) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (member) {
            loadBio();
        }
    }, [member]);

    const loadBio = async () => {
        setLoading(true);
        setContent(null);
        try {
            if (member.bio_url) {
                const data = await fetchBio(member.bio_url);
                setContent(data.html_content);
            } else {
                setContent("<p>No hay biografía disponible.</p>");
            }
        } catch (err) {
            setContent(`<p style="color: red;">Error al cargar la biografía: ${err.message}</p>`);
        } finally {
            setLoading(false);
        }
    };

    if (!member) return null;

    return (
        <div className="bio-modal-overlay" onClick={onClose}>
            <div
                className="bio-modal-content"
                onClick={e => e.stopPropagation()}
            >
                <div className="bio-modal-header">
                    <div className="bio-modal-header-info">
                        {member.thumbnail_url || member.photo_url ? (
                            <img
                                src={member.thumbnail_url || member.photo_url}
                                alt=""
                                className="bio-modal-avatar"
                            />
                        ) : null}
                        <div>
                            <h2 className="bio-modal-name">{member.name}</h2>
                            <p className="bio-modal-cargo">{member.cargo}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bio-close-button">
                        <X size={24} />
                    </button>
                </div>

                <div className="bio-modal-body custom-scrollbar">
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '16rem', gap: '1rem', color: '#9ca3af' }}>
                            <Loader2 className="animate-spin" size={48} />
                            <p>Cargando biografía...</p>
                        </div>
                    ) : (
                        <div
                            className="bio-prose"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                </div>

                <div className="bio-modal-footer">
                    <a
                        href={member.bio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bio-link-button"
                    >
                        <Globe size={14} />
                        Ver en lamoncloa.gob.es
                    </a>
                </div>
            </div>
        </div>
    );
}
