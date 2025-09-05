// Quick Bites - Main JavaScript File
console.log('Quick Bites Food Ordering Application - Loaded');

function showSectionfromHash() {
    const hash = window.location.hash;
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = (('#' + sec.id) === hash ? 'block' : 'none');
    });
}

window.addEventListener('hashchange', showSectionfromHash);
window.addEventListener('DOMContentLoaded', showSectionfromHash);