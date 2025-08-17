async function buildArkiveDropdown() {
    const dropdownIcons = document.getElementById("arkive-dropdown");

    try {
        // Fetch list of arkive pages (JSON array of URLs)
        const response = await fetch("/arkive/manifest.json");
        const pages = await response.json();

        for (const url of pages) {
            // Fetch each page to extract <title>
            const res = await fetch(url);
            const text = await res.text();
            const match = text.match(/<title>(.*?)<\/title>/i);
            const title = match ? match[1] : url;

            // Create the dropdown link
            const link = document.createElement("a");
            link.className = "navigation-icon";
            link.href = url;

            const span = document.createElement("span");
            span.textContent = title;

            link.appendChild(span);
            dropdownIcons.appendChild(link);
        }
    } catch (err) {
        console.error("Error building arkive dropdown:", err);
    }
}

buildArkiveDropdown();