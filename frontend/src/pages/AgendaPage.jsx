import React, { useEffect, useState } from 'react';
import { fetchAgenda } from '../services';
import { AgendaFilters } from '../components/AgendaFilters';
import { AgendaGroup } from '../components/AgendaGroup';
import { groupAgendaData } from '../utils';

export const AgendaPage = () => {
    const [groupedItems, setGroupedItems] = useState({});
    const [loading, setLoading] = useState(true);

    const loadData = async (filters = {}) => {
        setLoading(true);
        const data = await fetchAgenda(filters);
        const grouped = groupAgendaData(data);
        setGroupedItems(grouped);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleFilterChange = (filters) => {
        loadData(filters);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Agenda del Gobierno</h1>
            <AgendaFilters onFilterChange={handleFilterChange} />

            {loading ? (
                <p>Cargando agenda...</p>
            ) : (
                <div className="agenda-list">
                    {Object.keys(groupedItems).length === 0 ? (
                        <p>No hay eventos que coincidan con la búsqueda.</p>
                    ) : (
                        <AgendaGroup data={groupedItems} />
                    )}
                </div>
            )}
        </div>
    );
};
