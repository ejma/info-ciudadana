export const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function groupAgendaData(items) {
    const grouped = {};

    items.forEach(item => {
        if (!item.fecha) return;

        // Expect fecha "YYYY-MM-DD"
        const parts = item.fecha.split('-');
        if (parts.length !== 3) return;

        const [year, monthStr, day] = parts;
        const monthIndex = parseInt(monthStr, 10) - 1;

        if (isNaN(monthIndex) || monthIndex < 0 || monthIndex >= MONTH_NAMES.length) return;

        const monthName = MONTH_NAMES[monthIndex];
        const person = item.persona || 'Desconocido';

        if (!grouped[year]) grouped[year] = {};
        if (!grouped[year][monthName]) grouped[year][monthName] = {};
        if (!grouped[year][monthName][day]) grouped[year][monthName][day] = {};
        if (!grouped[year][monthName][day][person]) grouped[year][monthName][day][person] = [];

        grouped[year][monthName][day][person].push(item);
    });

    return grouped;
}

export function buildDateSkeleton(dates) {
    const skeleton = {};

    dates.forEach(dateStr => {
        // Expect "YYYY-MM-DD"
        const parts = dateStr.split('-');
        if (parts.length !== 3) return;

        const [year, monthStr, day] = parts;
        const monthIndex = parseInt(monthStr, 10) - 1;

        if (isNaN(monthIndex) || monthIndex < 0 || monthIndex >= MONTH_NAMES.length) return;

        const monthName = MONTH_NAMES[monthIndex];

        if (!skeleton[year]) skeleton[year] = {};
        if (!skeleton[year][monthName]) skeleton[year][monthName] = {};
        // Initialize day as null to indicate "not loaded"
        // If we already have data (from a previous load), we shouldn't overwrite it if we are rebuilding?
        // For now, let's assume we build skeleton once on mount.
        if (!skeleton[year][monthName][day]) skeleton[year][monthName][day] = null;
    });

    return skeleton;
}

export function groupByPerson(items) {
    const grouped = {};
    items.forEach(item => {
        const person = item.persona || 'Desconocido';
        if (!grouped[person]) grouped[person] = [];
        grouped[person].push(item);
    });
    return grouped;
}
