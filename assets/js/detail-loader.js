document.addEventListener("DOMContentLoaded", () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    const JSON_URL = "assets/js/projects-overview.json";

    const titleEl = document.getElementById('detailTitle');
    const descriptionEl = document.getElementById('detailDescription');
    const chipsEl = document.getElementById('detailChips');
    const galleryContainerEl = document.getElementById('detailGalleryContainer');

    if (!projectId) { window.location.href = 'work.html'; return; }

    fetch(JSON_URL)
        .then(res => res.json())
        .then(projects => {
            const projectData = projects.find(p => p.id === projectId);
            if (!projectData) return;

            document.title = `${projectData.title} - Adrián de Jesús`;
            titleEl.textContent = projectData.title;
            descriptionEl.innerHTML = `<p>${projectData.description}</p>`;

            chipsEl.innerHTML = '';
            projectData.categories.forEach(cat => {
                const chip = document.createElement("span");
                chip.className = "chip";
                chip.textContent = cat;
                chipsEl.appendChild(chip);
            });

            galleryContainerEl.innerHTML = '';

            if (projectData.gallery) {
                projectData.gallery.forEach(item => {
                    const galleryItemDiv = document.createElement('div');
                    galleryItemDiv.className = 'galleryItem';
                    
                    galleryItemDiv.classList.add(`col${item.cols}`); 
                    
                    if (item.aspect) {
                        galleryItemDiv.classList.add(`ratio${item.aspect}`); 
                    } else {
                        galleryItemDiv.classList.add('ratioAuto');
                    }

                    // 1. IMAGEN

                    if (item.type === 'image') {
                        const img = document.createElement('img');
                        img.src = item.src;
                        img.alt = projectData.title;
                        img.loading = "lazy";
                        galleryItemDiv.appendChild(img);

                    // 2. VIDEO LOCAL (MP4)

                    } else if (item.type === 'video') {
                        const video = document.createElement('video');
                        video.src = item.src;
                        video.autoplay = true; 
                        video.muted = true; 
                        video.loop = true;
                        video.playsInline = true;
                        galleryItemDiv.appendChild(video);

                    // 3. VIMEO 

                    } else if (item.type === 'vimeo') {
                        const iframe = document.createElement('iframe');
                        iframe.src = item.src;
                        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
                        iframe.setAttribute('allowfullscreen', '');
                        iframe.style.border = 'none';
                        galleryItemDiv.appendChild(iframe);

                    // 4. FIGMA 
                    
                    } else if (item.type === 'figma') {
                        const iframe = document.createElement('iframe');
                        iframe.src = item.src;
                        iframe.setAttribute('allowfullscreen', '');
                        // Estilo específico para que el embed de Figma se vea integrado y elegante
                        iframe.style.border = '1px solid rgba(0,0,0,0.1)'; 
                        galleryItemDiv.appendChild(iframe);
                    }
                    

                    galleryContainerEl.appendChild(galleryItemDiv);
                });
            }
        })
        .catch(err => console.error("Error cargando proyecto:", err));
});