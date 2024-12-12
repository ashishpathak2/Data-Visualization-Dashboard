# Interactive Data Visualization Dashboard

## Overview

This project is a responsive analytics dashboard designed for real-time product insights. It features interactive data visualization, advanced filtering options, cookie-based user preferences, and secure URL sharing for customized views. Built with a focus on functionality and user experience, this application includes a robust backend API and data pipeline for seamless data handling.

---

## Features

### Interactive Data Visualization

- Bar charts to represent features (e.g., A, B, C) and total time spent.
- Line charts to display time trends of selected categories, with pan, zoom-in, and zoom-out options.

### Advanced Filtering

- Filters for Age (15-25, >25) and Gender (Male, Female).
- Date range selector for analytics data.
- Dynamic graph updates based on selected filters and date range.

### Cookie Management

- Stores user preferences for filters and date range.
- Automatically applies preferences on revisit.
- Option to reset or clear preferences.

### URL Sharing

- Share filtered charts with specific filters and date ranges via URL.
- Shared links require user authentication to access.

### User Authentication

- Secure sign-up, login, and logout functionality.
- Ensures data confidentiality for authorized users only.

### Responsive Design

- Fully optimized for desktops, tablets, and mobile devices.

---

## Technical Details

### Frontend

- Template-Engine: Ejs.
- Chart Library: Chart.js.
- Responsive Styling: TailwindCSS.

### Backend

- Framework: Express Js.
- Database: MongoDB.
- API Integration: Handles data fetching, filtering, and chart updates.
- Data Pipeline: Processes data from the provided dataset for real-time analytics.

### Authentication

- Custom-Authentication.
- Express-session.

### Cookie Management

- Default Express-session Cookies.
- Stores and retrieves user preferences.

### Dataset

The project uses the dataset provided in the following link:
[Frontend Developer Assignment Data](https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0)

---

## Setup and Installation

### Prerequisites

- Node.js and npm installed.

### Steps

1. Clone the repository:
   ```bash
   git clone [repository_url]
   cd [repository_name]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run watch
   ```
4. Access the application in your browser at `http://localhost:3000`.

---

## Usage

1. Login or sign up to access the dashboard.
2. Apply filters for age, gender, and date range to visualize data.
3. Interact with charts by panning, zooming, or clicking on bars.
4. Share specific views using the URL sharing feature.
5. Clear or reset filters using the cookie management options.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any queries or feedback, please contact [Your Name or Email Address].

