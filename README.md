# CivicTrack — Zero-Installation Edition

A browser-only academic demonstration built with HTML, CSS and vanilla JavaScript.

## Requirements

- A modern web browser (Chrome, Edge, Firefox, etc.)
- No Node.js, npm, MySQL, server, framework or internet connection required.

## Run the project

1. Extract the ZIP file.
2. Open the `CivicTrack_Zero_Install` folder.
3. Double-click `index.html`.
4. The project opens in your browser.
5. Use **Citizen Portal** to submit a complaint.
6. Use **Municipal Portal** to view complaints and update their status.

## Features

- Citizen complaint submission
- Complaint reference number generation
- Complaint list and status tracking
- Municipal dashboard statistics
- Status filtering and status updates
- Browser localStorage persistence
- Responsive layout

## Important limitations

This is a front-end prototype for academic demonstration, not a production municipal application.

- Data is stored only in the current browser profile on this device.
- Clearing browser site data may erase the saved complaints.
- It does not synchronize across devices or users.
- The municipal dashboard is not protected by real authentication.
- Do not enter real personal, sensitive or confidential information.
- Browser localStorage is not a secure database; do not store passwords or sensitive data in it.

For a real deployment, connect the frontend to a backend API and database, and implement proper authentication, authorization, validation, audit logging and security protections.
