
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, User, Loader2, FileText } from 'lucide-react';

export function AgendaGroup({ data, level = 0, onDateExpand, path = [], membersMap = {}, onMemberClick }) {
    // CASE 1: Data has been loaded and is a list of items (Leaf content)
    if (Array.isArray(data)) {
        return (
            <div className="agenda-leaf-list">
                {data.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No hay registros para este día.</p>
                ) : (
                    data.map((item) => (
                        <div key={item.id} className="card agenda-item" style={{ marginBottom: '1rem' }}>
                            <div className="agenda-header">
                                <span className="agenda-time" style={{ fontWeight: 'bold' }}>{item.hora}</span>
                            </div>
                            {/* Cargo removed from here */}
                            <p className="agenda-desc">{item.descripcion}</p>
                        </div>
                    ))
                )}
            </div>
        );
    }

    // CASE 2: Data is null (Not loaded yet)
    if (data === null) {
        return (
            <div className="p-4 flex items-center gap-2 text-gray-500">
                <Loader2 className="animate-spin" size={16} />
                <span>Cargando agenda...</span>
            </div>
        );
    }

    // CASE 3: Group View
    const keys = Object.keys(data).sort((a, b) => {
        if (!isNaN(parseInt(a)) && !isNaN(parseInt(b))) return b - a;
        return 0; // Maintain insertion order
    });

    return (
        <div className="agenda-group">
            {keys.map(key => {
                let displayTitle = key;
                let memberInfo = null;

                // If Level 3 (Person), try to get info
                if (level === 3) {
                    // Check if person name (key) has info using fuzzy matching
                    if (membersMap) {
                        const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                        // Try to find a match in membersMap keys
                        const match = Object.keys(membersMap).find(mKey => {
                            const normalizedMKey = mKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return normalizedMKey.includes(normalizedKey) || normalizedKey.includes(normalizedMKey);
                        });

                        if (match) {
                            memberInfo = membersMap[match];
                        }
                    }

                    if (Array.isArray(data[key]) && data[key].length > 0) {
                        const cargo = data[key][0].cargo;
                        if (cargo) {
                            displayTitle = (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {key}
                                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 400 }}>
                                        {cargo}
                                    </span>
                                    {memberInfo && memberInfo.bio_url && onMemberClick && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onMemberClick(memberInfo);
                                            }}
                                            style={{
                                                marginLeft: 'auto',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: '#2563eb',
                                                fontSize: '0.8rem'
                                            }}
                                            title="Ver Biografía"
                                        >
                                            <FileText size={16} />
                                            <span style={{ textDecoration: 'underline' }}>Bio</span>
                                        </button>
                                    )}
                                </span>
                            );
                        }
                    }
                }

                return (
                    <CollapsibleGroup
                        key={key}
                        title={displayTitle}
                        level={level}
                        photoUrl={memberInfo ? (memberInfo.thumbnail_url || memberInfo.photo_url) : null}
                        onToggle={(isOpen) => {
                            if (isOpen && onDateExpand) {
                                onDateExpand([...path, key], data[key]);
                            }
                        }}
                    >
                        <AgendaGroup
                            data={data[key]}
                            level={level + 1}
                            onDateExpand={onDateExpand}
                            path={[...path, key]}
                            membersMap={membersMap} // Propagate
                            onMemberClick={onMemberClick} // Propagate
                        />
                    </CollapsibleGroup>
                );
            })}
        </div>
    );
}

function CollapsibleGroup({ title, level, children, onToggle, photoUrl }) {
    // Expand Year (0) and Month (1) by default? Maybe just Year.
    // Let's perform lazy load only on explicit user click usually, 
    // but maybe auto-expand first relevant year/month.
    // Auto-expand Person (level 3) so user sees items immediately after day load.
    const [isOpen, setIsOpen] = useState(level === 3);

    const handleToggle = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        if (onToggle) onToggle(nextState);
    };

    const getIcon = () => {
        if (level === 3) {
            if (photoUrl) {
                return <img src={photoUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />;
            }
            return <User size={18} />;
        }
        return <Calendar size={18} />;
    };

    const getStyle = () => {
        const base = { padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 };
        if (level === 0) return { ...base, fontSize: '1.5rem', borderBottom: '2px solid var(--primary-color)', color: 'var(--primary-color)' };
        if (level === 1) return { ...base, fontSize: '1.25rem', color: 'var(--secondary-color)', paddingLeft: '2rem' };
        if (level === 2) return { ...base, fontSize: '1.1rem', color: 'var(--text-primary)', paddingLeft: '3rem' };
        if (level === 3) return { ...base, fontSize: '1rem', color: 'var(--accent-color, #0f766e)', paddingLeft: '4rem' };
        return base;
    };

    // Label adjustment
    const label = level === 2 ? `Día ${title} ` : title;

    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <div
                onClick={handleToggle}
                style={getStyle()}
                className="group-header"
            >
                {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                {getIcon()}
                {label}
            </div>

            {isOpen && (
                <div className="group-content">
                    {children}
                </div>
            )}
        </div>
    );
}
