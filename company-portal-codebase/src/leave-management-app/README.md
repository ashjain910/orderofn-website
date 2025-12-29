# Leave Management App

## Overview
The Leave Management App is a web application designed to manage employee leave requests. It allows administrators to view, approve, reject, or hold leave requests submitted by employees. The application provides a user-friendly interface for managing leave requests efficiently.

## Features
- View leave requests in a table format.
- Approve, reject, or hold leave requests.
- Loading state management while fetching data.
- Consistent date formatting throughout the application.

## Technologies Used
- React: A JavaScript library for building user interfaces.
- JavaScript: The programming language used for the application logic.
- CSS: For styling the application.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd leave-management-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## File Structure
```
leave-management-app
├── src
│   ├── pages
│   │   ├── AdminPage.js
│   │   └── PageLoader.js
│   ├── pipes
│   │   └── formatDatePipe.js
│   ├── api
│   │   └── googleScriptApi.js
│   ├── context
│   │   └── LoaderProvider.js
│   └── index.js
├── package.json
├── README.md
└── .gitignore
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.