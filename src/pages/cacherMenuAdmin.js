
export const cacherPage = (role) => {
    // Sélectionner les éléments que le client ne doit pas voir (par exemple, une classe `.admin-page`)
    const pagesAmasquer = document.querySelectorAll(".admin-page");

    if (role === "client") {
        pagesAmasquer.forEach(page => {
            page.style.display = "none"; // Cacher la page
        });
    } else {
        pagesAmasquer.forEach(page => {
            page.style.display = "block"; // Afficher normalement pour les autres rôles
        });
    }
};
