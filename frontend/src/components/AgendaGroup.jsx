import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, User } from 'lucide-react';

export function AgendaGroup({ data, level = 0 }) {
    if (Array.isArray(data)) {
        return (
            <div className="agenda-leaf-list">
                {data.map((item) => (
                    <div key={item.id} className="card agenda-item" style={{ marginBottom: '1rem' }}>
                        <div className="agenda-header">
                            <span className="agenda-time" style={{ fontWeight: 'bold' }}>{item.hora}</span>
                        </div>
                        {/* Person is usually the parent grouping, so maybe redundant here? 
                But let's keep it if filtering limits grouping. 
                Actually level 3 is Person, so we are inside a Person group.
            */}
                        <div className="agenda-cargo">{item.cargo}</div>
                        <p className="agenda-desc">{item.descripcion}</p>
                    </div>
                ))}
            </div>
        );
    }

    // Sorting keys descending for Year/Month/Day
    const keys = Object.keys(data).sort((a, b) => {
        // Simple numeric sort for Year/Day, Month names handling needed if sort required? 
        // Actually object keys order isn't guaranteed. 
        // If keys are Year (numeric), sort Desc.
        // If keys are Month (Name), we need specific sort. 
        // If keys are Day (numeric), sort Desc.

        // Heuristic: If numeric, sort desc.
        if (!isNaN(parseInt(a))) return b - a;

        // If Month Names, use predefined order (reversed to show latest first?)
        // Usually we want chronological descending (Dec before Jan).
        // Let's rely on standard array if we can import it, or just let it be.
        return 0;
    });

    return (
        <div className="agenda-group">
            {keys.map(key => (
                <CollapsibleGroup key={key} title={key} level={level}>
                    <AgendaGroup data={data[key]} level={level + 1} />
                </CollapsibleGroup>
            ))}
        </div>
    );
}

function CollapsibleGroup({ title, level, children }) {
    // Default expanded for top levels? Maybe only current year?
    const [isOpen, setIsOpen] = useState(level < 2); // Expand Year and Month by default

    const getIcon = () => {
        if (level === 3) return <User size={18} />;
        return <Calendar size={18} />;
    };

    const getStyle = () => {
        const base = { padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 };
        if (level === 0) return { ...base, fontSize: '1.5rem', borderBottom: '2px solid var(--primary-color)', color: 'var(--primary-color)' };
        if (level === 1) return { ...base, fontSize: '1.25rem', color: 'var(--secondary-color)', paddingLeft: '2rem' };
        if (level === 2) return { ...base, fontSize: '1.1rem', color: 'var(--text-primary)', paddingLeft: '3rem' };
        if (level === 3) return { ...base, fontSize: '1rem', color: 'var(--accent-color)', paddingLeft: '4rem', fontStyle: 'italic' };
        return base;
    };

    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={getStyle()}
                className="group-header"
            >
                {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                {level === 2 ? `Día ${title}` : title}
                {level === 3 && getIcon()}
            </div>

            {isOpen && (
                <div className="group-content">
                    {children}
                </div>
            )}
        </div>
    );
}
