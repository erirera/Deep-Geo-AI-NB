# AI Geoscience Dashboard - Proposal 2

An interactive web dashboard for **Proposal 2: Automated Geological Contact Mapping** using Deep Learning Segmentation of Airborne Geophysical Data across New Brunswick.

## Overview

New Brunswick's bedrock geology continues to be revised as new geophysical surveys and geochronological data emerge. This dashboard https://erirera.github.io/Deep-Geo-AI-NB/ is a proof-of-concept visualizer for a deep learning workflow (such as a Lightweight U-Net) that predicts lithological contact locations from multi-channel gridded geophysical data (TMI, Radiometrics, Gravity). 

The goal is to automatically identify zones where current geology maps might be incorrect and support the NB Geological Survey Branch's mapping program.

## Features Included

- **Dark Mode UI**: A premium, aesthetics-forward interface using glassmorphism.
- **Interactive Leaflet Map**: Built on top of CartoDB Dark basemaps for contrast and clarity.
- **Mock Data Visualizations (Geological Boundaries)**: 
  *Note: All boundaries shown in this dashboard represent **geological bedrock contacts** (where one rock unit/terrane ends and another begins), not geographical or political borders (county lines, city limits).*
  - **Current NB Geology:** Existing geological terrane polygons, explicitly labeled with actual NB geological names (e.g., Miramichi Terrane, Tetagouche Group) mapped to the center of each region.
  - **AI-Predicted Contacts:** Stylized models representing the outputs of a deep learning segmentation network like U-Net showing where the AI predicts the true rock boundaries actually are (Dashed Lines).
  - **Revision Priority:** Highlighted structural conflict zones displaying where AI predictions most strongly disagree with the hand-drawn geological boundary, suggesting geologists need to ground-truth that area. The physical size of these polygons directly reflects the magnitude of the AI conflict score (Polygons/Heatmaps).
  - **Uncertainty Map:** Gradient spatial data simulating Monte Carlo Dropout inference values for probabilistic risk.
- **Deterministic Map Generation:** All map features (polygons, contacts, heatmaps) are procedurally generated using a seeded random number generator (Mulberry32). This guarantees that the mock visualizations render in the exact same position on every device and page refresh.
- **Dynamic CSS**: Custom tooltip styles, toggle switches, map legends, and real-time styled interactive layers.

## Technologies Used

- **HTML5 & Vanilla CSS3**
- **JavaScript (ES6+)**
- **Leaflet.js** (v1.9.4 for Web Mapping)
- **Turf.js** (v6 for client-side spatial generation & mocked data)
- **Google Fonts** (Inter & Outfit)
- **Remix Icons**

## Getting Started

This dashboard is entirely client-side and requires no build steps, backend services, or dependencies other than an internet connection (to fetch Leaflet, Turf, Maps, and Fonts via CDN).

1. Clone or download this directory.
2. Open `index.html` directly in any modern web browser.
   - Example (Windows): Double click `index.html` or drag it into Chrome/Edge/Firefox. 

### Development

To modify the mock data logic, simply open `script.js` and locate the `generateGeologyPolygons()`, `generateAIContacts()`, `generateRevisionPriority()`, and `createUncertaintyHeatmap()` functions.

To customize the visual theme, gradients, or typography, edit `styles.css`.

## Potential Future Expansions

- Import an actual GeoJSON of the NB Bedrock Geology layer.
- Integrate real Python/PyTorch inference data.
- Refactor the code to use React, Vue, or Next.js for more complex state management if the dashboard expands beyond a single view.

## Author

**Dele Falebita, PhD** — GIT APEGNB & Data Scientist  
[github.com/erirera](https://github.com/erirera) | Moncton, New Brunswick, Canada  
20+ years experience in geo-resource exploration, geostatistics, and geophysical data analysis.
