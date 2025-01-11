document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.createElement("nav");
    navbar.classList.add("navbar");

    const sidebar = document.createElement("aside");
    sidebar.classList.add("sidebar");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("sidebar-toggle");
    toggleButton.textContent = "☰"; // Icona per aprire la sidebar

    const overlay = document.createElement("div");
    overlay.classList.add("sidebar-overlay");

    const pages = [
        { name: "Home", link: "index.html" },
        { name: "Libri", link: "books.html" },
        { name: "Struttura Libro", link: "outline.html" },
        { name: "Scrittura", link: "writer.html" },
        { name: "Note", link: "notes.html" },
        { name: "Grimorio", link: "grimorio.html" }
    ];

    const currentPath = window.location.pathname.split("/").pop();

    // Funzione per popolare la navbar e la sidebar
    function populateMenus() {
        pages.forEach(page => {
            const anchor = document.createElement("a");
            anchor.href = page.link;
            anchor.textContent = page.name;
            anchor.classList.add("navbar-link");

            if (page.link === currentPath) {
                anchor.classList.add("active");
            }

            navbar.appendChild(anchor);

            const sidebarLink = anchor.cloneNode(true);
            sidebarLink.classList.add("sidebar-link");
            sidebar.appendChild(sidebarLink);
        });
    }

    // Inizializza navbar e sidebar
    populateMenus();

    document.body.prepend(navbar);
    document.body.prepend(sidebar);
    document.body.prepend(toggleButton);
    document.body.appendChild(overlay);

    console.log("Navbar e Sidebar caricate con successo!");

    // Funzione per mostrare/nascondere la sidebar
    function toggleSidebar() {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    }

    // Event listener per apertura/chiusura della sidebar
    toggleButton.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);

    // Funzione per gestire il comportamento navbar/sidebar
    function handleResponsive() {
        if (window.innerWidth <= 768) {
            navbar.style.display = "none";
            sidebar.style.display = "block";
            toggleButton.style.display = "block";
        } else {
            navbar.style.display = "flex";
            sidebar.style.display = "none"; // Nasconde la sidebar su schermi grandi
            sidebar.classList.remove("open");
            overlay.classList.remove("active");
            toggleButton.style.display = "none";
        }
    }

    // Gestisci il cambio di dimensioni dello schermo
    window.addEventListener("resize", handleResponsive);
    handleResponsive(); // Chiamata iniziale
});
