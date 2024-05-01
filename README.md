# E-signature API Documentation

Welcome to the documentation for the Digital signature project.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [1. Remove Team Members](#1-remove-team-members)
- [License](#license)

## Introduction

This project is inspired by the functionalities provided by signrequest.com, offering users a comprehensive platform for managing sign requests and documents. The system encompasses a range of features designed to enhance document handling, team collaboration, and security measures.

## Key Features

1. **Email-Based Signing Requests:**

   - Streamlined signing requests through a user-friendly email system.

2. **Document Management:**

   - Efficient tools for organizing, tracking, and accessing documents.

3. **Document Log Generation:**

   - Robust logging system capturing detailed records of document-related activities.

4. **Security Measures:**

   - Implementation of robust security protocols to safeguard sensitive data.

5. **Permission System:**

   - Versatile access control, ensuring data privacy and security.

6. **Team Collaboration:**

   - Features facilitating seamless collaboration among team members.

7. **User Management within Teams:**

   - Tools for efficient user management within teams.

8. **Different User Roles:**

   - Support for diverse user roles, tailoring access levels based on responsibilities.

9. **User Invitation via Email:**

   - Simplified onboarding through email invitations.

10. **RESTful APIs:**

    - Over 20 RESTful APIs provided for seamless integration with the frontend.

11. **User Authentication with Simple JWT:**
    - Secure user authentication powered by Simple JWT (JSON Web Tokens).

## Getting Started

### Prerequisites

#### For Backend

- Python 3.x
- Django
- Django REST framework
- asgiref==3.7.2
- black==23.12.1
- chardet==5.2.0
- click==8.1.7
- colorama==0.4.6
- Django==5.0.1
- django-cors-headers==4.3.1
- djangorestframework==3.14.0
- djangorestframework-simplejwt==5.3.1
- mypy-extensions==1.0.0
- packaging==23.2
- pathspec==0.12.1
- pillow==10.2.0
- platformdirs==4.1.0
- PyJWT==2.8.0
- pytz==2023.3.post1
- reportlab==4.0.9
- sqlparse==0.4.4
- tzdata==2023.4

### Installation for backend

1. Clone the repository:
   ```bash
   git clone https://github.com/dev3IREG50/ireg-e-signature.git
   ```
2. Navigate to the project directory:
   ```bash
   cd signrequest_backend
   ```
3. Create a virtual environment:
   - First install the virtual environemt
   ```bash
   python -m pip install virtualenv
   ```
   - Activate the virtual environment
   ```bash
   python -m env\scripts\activate (if you use VS code, it will automatically opens the virtual environment)
   ```
4. Install dependacies:
   ```bash
   pip install -r requirements.txt
   ```
5. If you use your own database server don't forget to make migrations
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### Navigating the Project:

Once you've successfully set up the project, head over to the base/api folder—it's
the heart of the implementation. Here's a breakdown of what you'll find in key directories:

###### custom_views:

- In this directory, you'll discover all the endpoints meticulously organized with modular and class documentation.
- Each endpoint is detailed and designed to be easily understood, ensuring a smooth exploration of the codebase.

###### utils:

- Dive into the utils folder to explore a collection of utility functions. Notably, this includes the logic behind email functionalities.

###### permissions:

- The permissions folder houses all the logic related to permissions, providing a centralized location for managing access controls.

### Prerequisites

#### Frontend Dependancies

- "@syncfusion/ej2-react-buttons": "^24.1.45",
- "@syncfusion/ej2-react-inputs": "^24.1.45",
- "@tanstack/react-query": "^4.35.7",
- "axios": "^1.6.3",
- "classnames": "^2.5.1",
- "date-fns": "^3.2.0",
- "jwt-decode": "^3.1.2",
- "lucide-react": "^0.303.0",
- "react": "^18.2.0",
- "react-dom": "^18.2.0",
- "react-dropzone": "^14.2.3",
- "react-pdf": "^7.7.0",
- "react-router-dom": "^6.21.1",
- "react-signature-canvas": "^1.0.6",
- "react-spinners": "^0.13.8",
- "sonner": "^1.3.1"

### Instalation for fronend

- Just make sure that you have the package.json file, and execute this command in the signrequest_frontend folder
  ```bash
  npm install
  ```
  This will install all the dependencies required for this project

### React Code Structure

The React side of the project is meticulously organized into eight distinct folders, each serving a specific purpose:

1. **`components`:**

   - This folder holds all the reusable components used throughout the project. These components are designed for versatility and can be easily incorporated into various sections.

2. **`contexts`:**

   - In the `contexts` folder, you'll find all the context files responsible for fetching data from Django and providing global state for each component in the project. These contexts ensure efficient state management across components.

3. **`forms`:**

   - The `forms` folder contains all the form components utilized in the project. These forms are thoughtfully structured to streamline user interactions and data submission.

4. **`hooks`:**

   - For custom functionality, head to the `hooks` folder. It houses all the custom hooks designed to enhance and simplify the functionality of the components.

5. **`images`:**

   - All static images are neatly organized in the `images` folder. This centralized location simplifies image management and retrieval throughout the project.

6. **`pages`:**

   - Within the `pages` folder, you'll find individual pages of the project. While the components in this folder are not designed for reuse, they represent entire pages and contribute to the overall project structure.

7. **`styles`:**

   - All CSS files, providing styling for each page, are consolidated in the `styles` folder. Each page has its own styling file with a similar name, facilitating easy navigation and maintenance.

8. **`utils`:**
   - The `utils` folder is crucial for asynchronous code execution and React's interaction with Django. All API calls happen within this folder, and each page has its own provider. If you want to explore how React interacts with Django, this is where you should invest your time.

###### Code Organization:

- My commitment to clarity is evident in the meticulous organization of the codebase.
  Detailed documentation accompanies each module and class, facilitating an intuitive understanding of the code.

Feel free to explore the project, and you'll find that the code is not just functional but also organized and easy to follow. If you have any questions or need further assistance, don't hesitate to reach out. Happy coding!
