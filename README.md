# KrushiMitra AI (कृषिमित्र AI)
**बळीराजा व बाजार समिती डिजिटल महामार्ग**

A clean, modern, and professional web platform bridging Farmers, Merchants, and APMC Administrators.

## Project Structure
- `src/`
  - `components/`
    - `Navbar.jsx`: Persistent navigation bar across portals with active role badge and "भूमिका बदला (Switch Role)" link.
    - `DashboardLayout.jsx`: Responsive layout container shell.
  - `pages/`
    - `RoleSelection.jsx`: Role selection portal (`/` & `/login`) with 3 distinct interactive cards.
    - `FarmerDashboard.jsx`: शेतकरी डॅशबोर्ड (`/farmer`) with emerald accent placeholder shell.
    - `MerchantDashboard.jsx`: व्यापारी डॅशबोर्ड (`/merchant`) with deep indigo accent placeholder shell.
    - `AdminDashboard.jsx`: APMC प्रशासकीय नियंत्रण (`/admin`) with slate accent placeholder shell.
  - `App.jsx`: Robust React Router configuration.
  - `index.css`: Tailwind CSS styling with crisp typography.
  - `main.jsx`: Application bootstrap.

## Scripts
- `npm run dev`: Launch the Vite development server on port 3000.
- `npm run build`: Production bundle build.
- `npm run preview`: Preview the production build locally.
