# StockAlert

A simple, offline-first inventory management app built for MSMEs.

## What is StockAlert?

StockAlert is a web and mobile-first inventory system that helps small business owners track product stock easily. It doesn't need internet or complicated setup. Just add your products, take photos, and track your inventory.

Built for real-world use: My father's auto parts shop in Abidjan, Côte d'Ivoire.

## The Problem It Solves

Small business owners in markets lose money because they:
- Don't know when stock runs low
- Can't quickly check inventory on the go
- Struggle with complex spreadsheets or pen and paper

StockAlert fixes this with a simple mobile app that works even without internet.

## Key Features

**Store and Track Products**
- Add products with name, cost, and minimum stock level
- Upload up to 4 photos per product (from camera or gallery)
- Set alerts for low stock items
- See products in a clean grid view

**Quick Stock Updates**
- Increase or decrease stock with simple buttons
- Bulk add/remove stock when restocking items
- Visual alerts when stock gets too low (red borders)
- Easy product search and filtering

**Works Offline**
- All data saved on your phone
- Works without internet connection
- Automatic sync when online

**Simple Design**
- No confusing buttons or menus
- Mobile responsive and fast
- Easy navigation
- Clear visual feedback

## Tech Stack

- React 
- IndexedDB for offline storage
- Supabase for backend features
- Recharts for analytics
- Lucide icons for the UI
- XLSX for exporting data

## Get Started

1. Clone the repository
```
git clone https://github.com/yourusername/stockalert.git
cd stockalert
```

2. Install dependencies
```
npm install
```

3. Start the app
```
npm start
```

Open http://localhost:3000 in your browser.

## Build for Production

```
npm run build
```

## Project Status

**Core Features: Working**
- Product management
- Stock tracking
- Image storage and zoom
- Offline functionality

**In Progress**
- Pricing system (cost and selling price)
- Better search and filters
- Bulk image upload
- Export reports to Excel

**Known Issues**
- Some bugs with image handling (being fixed)
- Bulk edit feature needs improvements

## Skills Demonstrated

**Frontend Development**
- React hooks and state management
- Component-based architecture
- Responsive design
- Real-time data validation

**Offline-First Architecture**
- IndexedDB for local storage
- Handling offline and online modes
- Data persistence

**Problem Solving**
- Built for real-world business needs
- Accessibility for non-technical users
- Mobile optimization

## Why I Built This

This project started as a solution to help my father manage his business better. I realized that not everyone has fancy point-of-sale systems or understands complex software. This app is proof that good design can make technology accessible to anyone, and that you can build something valuable by listening to real user needs.

## Next Steps

Want to help improve StockAlert? Feel free to:
- Test the app and report bugs
- Suggest new features
- Fork and contribute code

## Questions?

Feel free to reach out. I'm always happy to discuss the project, technology choices, or how to adapt it for different businesses.
