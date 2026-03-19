Excited to share a proof-of-concept AI Geoscience Dashboard I've been working on! 🌍⛏️

As part of a research proposal for **Deep Learning Segmentation of Airborne Geophysical Data for Lithological Mapping in NB**, this interactive web dashboard visualizes the potential outputs of a deep learning model (like a U-Net) applied to airborne geophysical data across New Brunswick.

The goal? To automatically identify zones where current bedrock geology maps might be incorrect so geologists know exactly where to prioritize their ground-truthing efforts.

Key features of this interactive concept include:
🗺️ Existing geology terranes labeled with actual NB geological names (Miramichi Terrane, Tetagouche Group, etc.)
🤖 AI-predicted lithological contacts overlaid against the hand-drawn geological boundaries
🔥 Revision Priority heatmaps where polygon sizes dynamically reflect the magnitude of the AI conflict score
📊 Uncertainty modeling simulating Monte Carlo Dropout inference values

Best part? It’s completely client-side. The dashboard uses Vanilla JS, Leaflet.js, and Turf.js with deterministic sequence seeding to render simulated outputs cleanly right in the browser—no backend required.

Check out the proposal here: https://erirera.github.io/Deep-Geo-AI-NB/

#Geology #ArtificialIntelligence #MachineLearning #Geoscience #DataVisualization #NewBrunswick #WebDevelopment #DeepLearning
