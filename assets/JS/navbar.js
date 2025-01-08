// navbar.js - Generazione dinamica della navbar

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.createElement("nav");
    navbar.classList.add("navbar");

    const pages = [
        { name: "Home", link: "index.html" },
        { name: "Libri", link: "books.html" },
        { name: "Struttura Libro", link: "outline.html" },
        { name: "Scrittura", link: "writer.html" },
        { name: "Note", link: "notes.html" }
    ];

    const currentPath = window.location.pathname.split("/").pop();

    pages.forEach(page => {
        const anchor = document.createElement("a");
        anchor.href = page.link;
        anchor.textContent = page.name;
        anchor.classList.add("navbar-link");

        // Aggiungi classe 'active' alla pagina corrente
        if (page.link === currentPath) {
            anchor.classList.add("active");
        }

        navbar.appendChild(anchor);
    });

    document.body.prepend(navbar);
    console.log("Navbar caricata con successo!");
});
