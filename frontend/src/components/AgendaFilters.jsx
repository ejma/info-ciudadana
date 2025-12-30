import React, { useState } from 'react';

export function AgendaFilters({ onFilterChange }) {
    const [filters, setFilters] = useState({
        persona: '',
        cargo: '',
        fecha: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        onFilterChange(filters);
    };

    // Allow pressing Enter to search
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Persona</label>
                <input
                    type="text"
                    name="persona"
                    placeholder="Ej: Pedro Sánchez"
                    value={filters.persona}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={inputStyle}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Cargo</label>
                <input
                    type="text"
                    name="cargo"
                    placeholder="Ej: Ministro"
                    value={filters.cargo}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={inputStyle}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Fecha</label>
                <input
                    type="date"
                    name="fecha"
                    value={filters.fecha}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={inputStyle}
                />
            </div>

            <button onClick={handleSearch} style={buttonStyle}>
                Buscar
            </button>
        </div>
    );
}

const inputStyle = {
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    width: '100%'
};

const buttonStyle = {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    height: '38px' // Align with inputs
};
