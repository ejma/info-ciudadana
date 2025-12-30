export const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function groupAgendaData(items) {
    const grouped = {};

    items.forEach(item => {
        // Expect fecha "YYYY-MM-DD"
        const [year, monthStr, day] = item.fecha.split('-');
        const monthIndex = parseInt(monthStr, 10) - 1;
        const monthName = MONTH_NAMES[monthIndex];
        const person = item.persona;

        if (!grouped[year]) grouped[year] = {};
        if (!grouped[year][monthName]) grouped[year][monthName] = {};
        if (!grouped[year][monthName][day]) grouped[year][monthName][day] = {};
        if (!grouped[year][monthName][day][person]) grouped[year][monthName][day][person] = [];

        grouped[year][monthName][day][person].push(item);
    });

    return grouped;
}
