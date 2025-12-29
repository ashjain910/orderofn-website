# Leave Management App

## Overview
This Leave Management App is a simple React application that allows users to submit leave requests and enables administrators to manage those requests. The application interacts with the Google Script API for backend functionality.

## Project Structure
```
leave-management-app
├── public
│   └── index.html
├── src
│   ├── api
│   │   └── googleScriptApi.js
│   ├── components
│   │   ├── AdminDashboard.js
│   │   ├── LeaveRequestForm.js
│   │   ├── LeaveList.js
│   │   └── Navbar.js
│   ├── pages
│   │   ├── AdminPage.js
│   │   └── UserPage.js
│   ├── App.js
│   ├── index.js
│   └── styles
│       └── bootstrap-custom.css
├── package.json
├── README.md
└── .gitignore
```

## Technologies Used
- React
- Bootstrap
- Google Script API
- Node.js (v22.14.0)
- npm (v11.2.0)

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd leave-management-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Features
- **User Page**: Users can submit leave requests through a form and view their submitted requests.
- **Admin Page**: Admins can view all leave requests and manage them from a dashboard.
- **Responsive Design**: The application is styled using Bootstrap for a responsive layout.

## API Integration
The application communicates with the Google Script API to fetch and submit leave requests. Ensure that the API is properly set up and accessible.

## Customization
You can customize the styles in `src/styles/bootstrap-custom.css` to fit your design preferences.

## License
This project is open-source and available under the MIT License.