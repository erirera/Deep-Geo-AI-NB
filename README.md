# AI Geoscience Dashboard - Proposal 2

An interactive web dashboard for **Proposal 2: Automated Geological Contact Mapping** using Deep Learning Segmentation of Airborne Geophysical Data across New Brunswick.

## Overview

New Brunswick's bedrock geology continues to be revised as new geophysical surveys and geochronological data emerge. This dashboard is a proof-of-concept visualizer for a deep learning workflow (such as a Lightweight U-Net) that predicts lithological contact locations from multi-channel gridded geophysical data (TMI, Radiometrics, Gravity). 

The boundaries shown in the dashboard represent **geological boundaries** (specifically, the contacts between different rock units or geological terranes), not geographical/political boundaries like county lines or city limits.

In the context of Proposal 2 ("Automated Geological Contact Mapping"), the deep learning model (U-Net) is analyzing airborne geophysical data (magnetics, radiometrics, etc.) to detect where one type of bedrock ends and another begins beneath the surface. 

Here is what the specific layers represent geologically:
1.  **Existing Terranes (Colored Polygons):** This represents the *current* understanding of New Brunswick's bedrock geology, mapped out by geologists over the years.
2.  **AI Contact Boundaries (Cyan Dashed Lines):** This represents where the AI *predicts* the true rock boundaries actually are, based purely on the physical properties measured by the airborne surveys.
3.  **Revision Priority (Pink Highlights):** These are zones where the AI's predicted geological boundary significantly disagrees with the old, hand-drawn geological boundary, suggesting geologists need to go back and check that specific area.

The goal is to automatically identify zones where current geology maps might be incorrect and support the NB Geological Survey Branch's mapping program.

## Features Included

- **Dark Mode UI**: A premium, aesthetics-forward interface using glassmorphism.
- **Interactive Leaflet Map**: Built on top of CartoDB Dark basemaps for contrast and clarity.
- **Mock Data Visualizations (Geological Boundaries)**: 
  *Note: All boundaries shown in this dashboard represent **geological bedrock contacts** (where one rock unit/terrane ends and another begins), not geographical or political borders (county lines, city limits).*
  - **Current NB Geology:** Existing geological terrane boundaries based on current mapping and understanding (Polygons).
  - **AI-Predicted Contacts:** Stylized models representing the outputs of a deep learning segmentation network like U-Net showing where the AI predicts the true rock boundaries actually are (Dashed Lines).
  - **Revision Priority:** Highlighted structural conflict zones displaying where AI predictions most strongly disagree with the hand-drawn geological boundary, suggesting geologists need to ground-truth that area (Polygons/Heatmaps).
  - **Uncertainty Map:** Gradient spatial data simulating Monte Carlo Dropout inference values for probabilistic risk.
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
