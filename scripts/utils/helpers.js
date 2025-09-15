// Suchfunktion mit Debouncing
let searchTimeout;
export const debouncedSearch = (searchTerm, callback, delay = 300) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        callback(searchTerm);
    }, delay);
};

// Datumsformatierung
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Export als PDF
export const exportAsPDF = async (elementId, filename) => {
    // Hier könnte eine PDF-Export-Funktion implementiert werden
    console.log('PDF Export würde jetzt erfolgen für:', elementId);
};
