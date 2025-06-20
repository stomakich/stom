document.addEventListener('DOMContentLoaded', function () {
    const floorTabs = document.querySelectorAll('.floor-tab');
    const floorMaps = document.querySelectorAll('.floor-map');
    const currentFloorIndicator = document.getElementById('current-floor');

    const locationImage = document.getElementById('location-image');
    const locationTitle = document.getElementById('location-title');
    const locationDesc = document.getElementById('location-desc');
    const locationHours = document.getElementById('location-hours');

    const highlight = document.createElement('div');
    highlight.className = 'map-highlight';
    document.querySelector('.station-map').appendChild(highlight);

    function showDefaultArea(areaId) {
        const area = document.getElementById(areaId);
        if (!area) return;

        const coords = area.coords.split(',').map(Number);
        const shape = area.shape;

        applyHighlight(shape, coords);
        updateInfo(area);
    }

    function applyHighlight(shape, coords) {
        if (shape === 'rect') {
            highlight.style.width = `${coords[2] - coords[0]}px`;
            highlight.style.height = `${coords[3] - coords[1]}px`;
            highlight.style.left = `${coords[0]}px`;
            highlight.style.top = `${coords[1]}px`;
            highlight.style.borderRadius = '4px';
        } else if (shape === 'circle') {
            const radius = coords[2];
            highlight.style.width = `${radius * 2}px`;
            highlight.style.height = `${radius * 2}px`;
            highlight.style.left = `${coords[0] - radius}px`;
            highlight.style.top = `${coords[1] - radius}px`;
            highlight.style.borderRadius = '50%';
        } else if (shape === 'poly') {
            const xCoords = coords.filter((_, i) => i % 2 === 0);
            const yCoords = coords.filter((_, i) => i % 2 === 1);
            const minX = Math.min(...xCoords);
            const maxX = Math.max(...xCoords);
            const minY = Math.min(...yCoords);
            const maxY = Math.max(...yCoords);

            highlight.style.width = `${maxX - minX}px`;
            highlight.style.height = `${maxY - minY}px`;
            highlight.style.left = `${minX}px`;
            highlight.style.top = `${minY}px`;
            highlight.style.borderRadius = '4px';
        }

        highlight.style.display = 'block';
    }

    function updateInfo(area) {
        locationImage.style.opacity = '0';
        locationImage.src = area.dataset.img;
        locationImage.onload = () => {
            locationImage.style.opacity = '1';
        };
        locationTitle.textContent = area.dataset.title;
        locationDesc.textContent = area.dataset.desc;
        locationHours.innerHTML = `<i class="fas fa-clock"></i> ${area.dataset.hours}`;
    }

    // Десктоп: mouseenter
    document.querySelectorAll('area').forEach(area => {
        area.addEventListener('mouseenter', function () {
            const coords = this.coords.split(',').map(Number);
            applyHighlight(this.shape, coords);
            updateInfo(this);
        });
    });

    // Мобильные: клик
    document.querySelectorAll('area').forEach(area => {
        area.addEventListener('click', function () {
            const coords = this.coords.split(',').map(Number);
            applyHighlight(this.shape, coords);
            updateInfo(this);
        });
    });

    // Переключение этажей
    floorTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const floor = this.dataset.floor;
            const defaultArea = this.dataset.defaultArea;

            floorTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            floorMaps.forEach(map => {
                map.classList.remove('active');
                if (map.dataset.floor === floor) {
                    map.classList.add('active');
                }
            });

            currentFloorIndicator.textContent = floor;
            showDefaultArea(defaultArea);
        });
    });

    showDefaultArea('main-hall');
});