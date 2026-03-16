// Map Initialization
// Centered roughly on New Brunswick
const map = L.map('map', {
    zoomControl: false 
}).setView([46.5653, -66.4619], 7);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Add Dark CartoDB basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    pane: 'overlayPane',
    zIndex: 100
}).addTo(map);

// Simple Seeded Random Number Generator (Mulberry32)
function splitmix32(a) {
    return function() {
      a |= 0; a = a + 0x9e3779b9 | 0;
      var t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
      t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
      return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
}
let seed = 12345;
let seededRandom = splitmix32(seed);

// Override turf's internal random usage with our seeded one if possible,
// but turf.randomPoint uses Math.random internally. 
// We'll reimplement randomPoint deterministically to fix polygons.
function generateSeededPoints(count, bbox) {
    const points = [];
    for(let i=0; i<count; i++) {
        const x = bbox[0] + seededRandom() * (bbox[2] - bbox[0]);
        const y = bbox[1] + seededRandom() * (bbox[3] - bbox[1]);
        points.push(turf.point([x, y]));
    }
    return turf.featureCollection(points);
}

const terraneNames = [
    'Miramichi Terrane', 'Elmtree Inlier', 'Tetagouche Group', 'Fournier Group',
    'Chaleur Bay Synclinorium', 'Fredericton Cover Sequence', 'Mascarene Group',
    'Avalon Terrane', 'Caledonia Highlands', 'Kingston Terrane', 'Brookville Terrane',
    'New River Belt', 'St. Croix Terrane', 'Annidale Group', 'Ganderia'
];

// 1. Current NB Geology (Polygons)
function generateGeologyPolygons() {
    seededRandom = splitmix32(12345); // Reset seed for determinism
    const points = generateSeededPoints(15, nbBbox);
    const voronoi = turf.voronoi(points, {bbox: nbBbox});
    
    // Assign random colors/properties
    voronoi.features.forEach((f, i) => {
        if(f) {
            f.properties = {
                id: i,
                terrane: terraneNames[i % terraneNames.length],
                color: `hsl(${(i * 45) % 360}, 50%, 40%)`,
                center: f.geometry.coordinates[0][0] // fallback for centroid
            };
            
            // calculate real centroid for label placement
            try {
                const centroid = turf.centroid(f);
                f.properties.center = centroid.geometry.coordinates;
            } catch (e) {}
        }
    });
    return voronoi;
}

const geologyData = generateGeologyPolygons();

const geologyStyle = (feature) => ({
    fillColor: feature.properties.color,
    weight: 1,
    opacity: 0.4,
    color: '#ffffff',
    fillOpacity: 0.2
});

const layerGeology = L.geoJSON(geologyData, {
    style: geologyStyle,
    onEachFeature: (feature, layer) => {
        // Add permanent text label to the center of the polygon
        if (feature.properties.center) {
            L.marker([feature.properties.center[1], feature.properties.center[0]], {
                icon: L.divIcon({
                    className: 'terrane-label',
                    html: `<div>${feature.properties.terrane}</div>`,
                    iconSize: [120, 20],
                    iconAnchor: [60, 10]
                }),
                interactive: false // Let clicks pass through to the polygon
            }).addTo(map);
        }

        layer.bindTooltip(`<b>${feature.properties.terrane}</b><br>Existing Survey`, {
            sticky: true,
            className: 'custom-tooltip'
        });
        
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    fillOpacity: 0.4,
                    weight: 2
                });
            },
            mouseout: (e) => {
                layerGeology.resetStyle(e.target);
            }
        });
    }
}).addTo(map);


// 2. AI Predicted Contacts (Lines)
function generateAIContacts(voronoiFeatures) {
    seededRandom = splitmix32(54321); // Reset seed
    const lines = [];
    voronoiFeatures.forEach(f => {
        if (!f) return;
        const coords = f.geometry.coordinates[0];
        const newCoords = coords.map((c, i) => {
            if (i % 2 === 0) {
                return [
                    c[0] + (seededRandom() - 0.5) * 0.05,
                    c[1] + (seededRandom() - 0.5) * 0.05
                ];
            }
            return c;
        });
        
        lines.push(turf.lineString(newCoords, { model: 'U-Net v1.2', confidence: seededRandom() }));
    });
    return turf.featureCollection(lines);
}

const aiContactsData = generateAIContacts(geologyData.features);

const layerAIContacts = L.geoJSON(aiContactsData, {
    style: (feature) => ({
        color: '#00E5FF',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 5'
    }),
    onEachFeature: (feature, layer) => {
        layer.bindTooltip(`<b>AI Predicted Contact</b><br>Confidence: ${(feature.properties.confidence * 100).toFixed(1)}%`, {
            sticky: true,
            className: 'custom-tooltip'
        });
        
        layer.on('mouseover', () => {
            layer.setStyle({ weight: 5, color: '#FFFFFF', opacity: 1 });
        });
        layer.on('mouseout', () => {
            layerAIContacts.resetStyle(layer);
        });
    }
}).addTo(map);

// 3. Revision Priority (High conflict areas - Polygons)
function generateRevisionPriority() {
    seededRandom = splitmix32(98765); // Reset seed
    const polygons = [];
    for(let i=0; i<8; i++) {
        const center = [
            nbBbox[0] + seededRandom() * (nbBbox[2] - nbBbox[0]),
            nbBbox[1] + seededRandom() * (nbBbox[3] - nbBbox[1])
        ];
        const priorityScore = seededRandom();
        // Base size on the priority score: higher score = larger polygon (between 5km and 25km radius)
        const radius = (priorityScore * 20) + 5; 
        const poly = turf.circle(center, radius, {steps: 8, units: 'kilometers'});
        const jagged = turf.transformScale(poly, seededRandom() * 0.5 + 0.8);
        jagged.properties = { priority: priorityScore };
        polygons.push(jagged);
    }
    return turf.featureCollection(polygons);
}

const revisionData = generateRevisionPriority();
const generateHeatmapLayer = (data, weightColor, opacityMult) => {
     let layerGroup = L.layerGroup();
     data.features.forEach(f => {
        const p = f.properties.priority * opacityMult;
        L.geoJSON(f, {
            style: {
                fillColor: weightColor,
                weight: 0,
                fillOpacity: p
            },
            onEachFeature: (feature, layer) => {
                 layer.bindTooltip(`<b>Revision Priority</b><br>Score: ${(f.properties.priority * 10).toFixed(1)}/10`, {
                     sticky: true,
                     className: 'custom-tooltip'
                 });
            }
        }).addTo(layerGroup);
     });
     return layerGroup;
};
const layerRevision = generateHeatmapLayer(revisionData, '#FF4081', 0.6);

// 4. Uncertainty Heatmap
function createUncertaintyHeatmap() {
    seededRandom = splitmix32(112233); // Reset seed
    const layerGroup = L.layerGroup();
    const points = generateSeededPoints(150, nbBbox);
    
    points.features.forEach(f => {
        const coord = f.geometry.coordinates;
        const val = seededRandom();
        
        const color = val > 0.8 ? '#FF4081' : val > 0.5 ? '#FFB300' : 'transparent';
        
        if (color !== 'transparent') {
            L.circle([coord[1], coord[0]], {
                radius: (seededRandom() * 8000 + 4000), // radius in meters
                fillColor: color,
                color: 'transparent',
                fillOpacity: (val - 0.4) * 0.8
            }).bindTooltip(`<b>Uncertainty</b><br>Score: ${(val*10).toFixed(1)}/10`, {
                sticky: true,
                className: 'custom-tooltip'
            }).addTo(layerGroup);
        }
    });
    
    return layerGroup;
}
const layerUncertainty = createUncertaintyHeatmap();


// -- Interactivity & UI Logic --

const toggles = {
    'layer-geology': { layer: layerGeology, ds: 'geology' },
    'layer-ai-contacts': { layer: layerAIContacts, ds: 'ai-contacts' },
    'layer-revision': { layer: layerRevision, ds: 'revision' },
    'layer-uncertainty': { layer: layerUncertainty, ds: 'uncertainty' }
};

Object.keys(toggles).forEach(id => {
    const checkbox = document.getElementById(id);
    checkbox.addEventListener('change', (e) => {
        const { layer, ds } = toggles[id];
        
        if (e.target.checked) {
            map.addLayer(layer);
        } else {
            map.removeLayer(layer);
        }
        
        const legItem = document.querySelector(`.legend-item[data-layer="${ds}"]`);
        if (legItem) {
            legItem.style.display = e.target.checked ? 'flex' : 'none';
        }
    });
});

// CSS for Custom Tooltip
const style = document.createElement('style');
style.innerHTML = `
    .custom-tooltip.leaflet-tooltip {
        background: rgba(15, 17, 21, 0.9);
        border: 1px solid rgba(255,255,255,0.1);
        color: #f0f2f5;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        backdrop-filter: blur(8px);
        font-family: 'Inter', sans-serif;
    }
    .custom-tooltip.leaflet-tooltip b {
        color: #00E5FF;
    }
    .custom-tooltip.leaflet-tooltip-top:before, 
    .custom-tooltip.leaflet-tooltip-bottom:before, 
    .custom-tooltip.leaflet-tooltip-left:before, 
    .custom-tooltip.leaflet-tooltip-right:before {
        display: none;
    }
`;
document.head.appendChild(style);

// Animate metrics on load
document.querySelectorAll('.metric-value').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
        el.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, Math.random() * 500 + 300);
});
