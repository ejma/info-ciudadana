import React, { useEffect, useState } from 'react';
import { fetchAgenda, fetchAvailableDates, fetchGovernment } from '../services'; // Import fetchGovernment
import { AgendaFilters } from '../components/AgendaFilters';
import { AgendaGroup } from '../components/AgendaGroup';
import { BioModal } from '../components/BioModal';
import { buildDateSkeleton, MONTH_NAMES, groupByPerson } from '../utils';

export const AgendaPage = () => {
    const [dateStructure, setDateStructure] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    // Store full member info: name -> member object
    const [membersMap, setMembersMap] = useState({});
    const [selectedBioMember, setSelectedBioMember] = useState(null);

    // Initial load of dates (Skeleton)
    useEffect(() => {
        loadSkeleton(filters);
        loadMembers();
    }, [filters]);

    const loadMembers = async () => {
        try {
            const govData = await fetchGovernment();
            const map = {};
            govData.forEach(member => {
                map[member.name] = member;
            });
            setMembersMap(map);
        } catch (e) {
            console.error("Failed to load government members", e);
        }
    };

    const loadSkeleton = async (currentFilters) => {
        setLoading(true);
        setError(null);
        try {
            const dates = await fetchAvailableDates(currentFilters);
            const skeleton = buildDateSkeleton(dates);
            setDateStructure(skeleton);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleDateExpand = async (path, currentData) => {
        // Path: [Year, MonthName, Day]
        if (path.length !== 3) return;
        const [year, monthName, day] = path;

        // If data is already loaded (not null), do nothing
        if (currentData !== null) return;

        // Calculate YYYY-MM-DD
        const monthIndex = MONTH_NAMES.indexOf(monthName);
        if (monthIndex === -1) return;

        const monthStr = String(monthIndex + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${monthStr}-${dayStr}`;

        try {
            // Fetch records for this specific day
            // We pass current filters (Persona/Cargo) + Specific Date
            const queryFilters = { ...filters, fecha: dateStr };
            const data = await fetchAgenda(queryFilters);

            // Group by Person
            const groupedByPerson = groupByPerson(data);

            // Update state
            setDateStructure(prev => ({
                ...prev,
                [year]: {
                    ...prev[year],
                    [monthName]: {
                        ...prev[year][monthName],
                        [day]: groupedByPerson
                    }
                }
            }));

        } catch (err) {
            console.error("Error loading day:", err);
            // Optionally set error state for that day or globally?
            // For now, let's just log it. 
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Agenda del Gobierno</h1>
            <AgendaFilters onFilterChange={handleFilterChange} />

            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '1rem', borderRadius: '0.375rem' }}>
                    Error cargando datos: {error}
                </div>
            )}

            <div className="agenda-list">
                {Object.keys(dateStructure).length === 0 && !loading ? (
                    <p>No hay fechas disponibles para esta búsqueda.</p>
                ) : (
                    <AgendaGroup
                        data={dateStructure}
                        onDateExpand={handleDateExpand}
                        membersMap={membersMap}
                        onMemberClick={setSelectedBioMember}
                    />
                )}

                {loading && (
                    <p className="text-gray-500 mt-4">Actualizando fechas...</p>
                )}
            </div>

            {selectedBioMember && (
                <BioModal
                    member={selectedBioMember}
                    onClose={() => setSelectedBioMember(null)}
                />
            )}
        </div>
    );
};
