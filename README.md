# README
# RESTful API - University Timetable Management System

## Table of Contents
1. [Introduction](#introduction)
2. [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
3. [API Endpoint Documentation](#api-endpoint-documentation)
4. [Running Tests](#running-tests)
    - [Unit Tests](#unit-tests)
    - [Integration Tests](#integration-tests)
    - [Performance Tests](#performance-tests)
    - [Setup for Testing Environments](#test-env)
5. [Additional Information](#additional-information)

## Introduction <a name="introduction"></a>
This README provides details on setting up, using, and testing the project. The project aims to build a Secure RESTful API for a University Timetable Management System which provide functionality for enrollments, timetables, managing notifications and other related features.

## Setup Instructions <a name="setup-instructions"></a>
### Prerequisites
- Node.js installed on your machine
- MongoDB installed and running locally or accessible via a URL

### Installation
1. **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
2. **Navigate to the project directory:**
    ```bash
    cd <project_directory>
    ```
3. **Install dependencies:**
    ```bash
    npm install
    ```
4. **Set up environment variables:**
    - Create a `.env` file in the root directory
    - Define the following environment variables in the `.env` file:
        ```makefile
        DATABASE_CONNECTION_URL  = <mongodb_connection_string>
        PORT = <port_number>
        ACCESS_TOKEN_SECRET_KEY = <key>
        ```
        - Replace `<mongodb_connection_string>`  with the connection string for your MongoDB instance.
        - Replace `<PORT>` with the port number. 
        - Replace `<ACCESS_TOKEN_SECRET_KEY>`  with the access token key for JWT.

5. **Run the project**
    ```bash
    npm run dev
    ```

## API Endpoint Documentation <a name="api-endpoint-documentation"></a>
The API provides the following endpoints:

### 1. Users
- **POST** `/api/users/register`: Register a new user.
- **POST** `/api/users/login`: Login a user.
- **GET** `/api/users/current`: Get current user information.

### 2. Courses
- **GET** `/api/courses`: Get all courses.
- **GET** `/api/courses/:id`: Get a course by ID.
- **POST** `/api/courses`: Create a new course.
- **DELETE** `/api/courses/:id`: Delete a course.
- **PUT** `/api/courses/:id`: Update a course.
- **PUT** `/api/courses/assignFacultyMemberToCourse`: Assign a faculty member to a course.

### 3. Timetables
- **POST** `/api/timetables`: Create a new timetable entry.
- **PUT** `/api/timetables/:id`: Update a timetable entry.
- **DELETE** `/api/timetables/:id`: Delete a timetable entry.
- **GET** `/api/timetables`: Get all timetables.

### 4. Class rooms and Resouses 
- **GET** `/api/classrooms`: Get all rooms.
- **GET** `/api/classrooms/:id`: Get a room by ID.
- **POST** `/api/classrooms`: Add a new room.
- **PUT** `/api/classrooms/:id`: Update a room.
- **DELETE** `/api/classrooms/:id`: Delete a room.

### 5. Bokings
- **GET** `/api/bookings`: Get all bookings.
- **POST** `/api/bookings`: Book a room.
- **DELETE** `/api/bookings/:id`: Delete a booking by ID.

### 6. Enrollments
- **POST** `/api/enrollments/enroll`: Enroll to a course.
- **GET** `/api/enrollments/timetable`: Get timetable of a student.
- **GET** `/api/enrollments/enrollments`: Get all enrollments.
- **DELETE** `/api/enrollments/enrollments/:id`: Unenrool from a course.

### 7. Notifications
- **GET** `/api/notifications`: Retrieve notifications for a specific user.
- **POST** `/api/notifications/announcement`: Create an important announcement.

## Running Tests <a name="running-tests"></a>
### Unit Tests <a name="unit-tests"></a>
- Used Jest library for unit testing
Unit tests can be run using the following command:
```bash
npx jest
```

### Integration Tests <a name="integration-tests"></a>
- Used Jest library for integration testing
Integration tests can be run using the following command:
```bash
npx jest
```
### Performance Tests <a name="performance-tests"></a>
- Used  artillery.io library for performance testing
Performance tests can be run using the following command:
```bash
artillery run test-script.yaml
```

### Setup for Testing Environments<a name="test-env"></a>
- For integration tests, ensure that the environment variables are properly configured, including the MongoDB connection string and port number.
- Performance tests may require additional setup, such as configuring the test-script.yaml file with the appropriate endpoint URLs and payloads.



## Additional Information <a name="additional-information"></a>
- For detailed information on each API endpoint, refer to the API Endpoint Documentation section.
- Make sure to configure environment variables properly for testing environments to avoid errors.
- Contact the project maintainers for any additional assistance or information.
- Editor : IT21271182 - Rathnayake R M U V 