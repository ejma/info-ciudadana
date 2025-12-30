import React, { useEffect, useState } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { fetchGovernment } from '../services';
import { BioModal } from '../components/BioModal';
import './GovernmentPage.css';

export function GovernmentPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBioMember, setSelectedBioMember] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchGovernment();
            setMembers(data);
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
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem' }}>
            Error: {error}
        </div>
    );

    return (
        <div className="government-page">
            <h1 className="page-title">Composición del Gobierno</h1>

            <div className="members-grid">
                {members.map((member, index) => (
                    <div key={index} className="member-card">
                        <div className="image-container group">
                            {member.thumbnail_url || member.photo_url ? (
                                <img
                                    src={member.thumbnail_url || member.photo_url}
                                    alt={member.name}
                                    className="member-photo"
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                    <span style={{ fontSize: '2.25rem' }}>?</span>
                                </div>
                            )}
                            <div className="bio-overlay">
                                <button
                                    onClick={() => setSelectedBioMember(member)}
                                    className="bio-button"
                                >
                                    <FileText size={16} />
                                    Leer Biografía
                                </button>
                            </div>
                        </div>
                        <div className="card-content">
                            <h3 className="member-name">{member.name}</h3>
                            <p className="member-cargo">{member.cargo}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedBioMember && (
                <BioModal
                    member={selectedBioMember}
                    onClose={() => setSelectedBioMember(null)}
                />
            )}
        </div>
    );
}
