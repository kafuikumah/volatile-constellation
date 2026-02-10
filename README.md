# African Debt Monitoring Mechanism

An interactive platform to monitor and analyze debt metrics for 55 African Union Member States.

## Features

- **Dashboard**: High-level continent overview using an interactive **GeoJSON Map** and consolidated key indicators.
- **Countries View**: Searchable grid of all 55 member states with risk indicators.
- **Comparison Tool**: Compare key metrics across multiple countries with interactive charts.
- **Predictive Risk Model**: "Traffic Light" system (Red/Yellow/Green) based on World Bank & IMF DSAs.
- **Data Source**: Real-time data from the World Bank Open Data API.

## technologies

- React + Vite
- Recharts (Charts)
- React Leaflet (Maps)
- Lucide React (Icons)
- Vanilla CSS (High Contrast Dark Theme)

## How to Run

### Prerequisites
1. **Node.js**: Install from [nodejs.org](https://nodejs.org/).

### Installation & Running
1. Open a terminal in this project folder:
   ```powershell
   cd "C:\Users\Joseph Mireku Nti\.gemini\antigravity\scratch\african-debt-monitor"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the app:
   ```powershell
   npm run dev
   ```

4. Open the URL shown (e.g., `http://localhost:5173`).

## Project Structure

- `src/components/Dashboard.jsx`: Map and aggregated stats only.
- `src/components/CountryList.jsx`: Searchable grid of all countries.
- `src/components/MapVisualization.jsx`: Interactive map component.
- `src/utils/debtModel.js`: Risk classification logic.
