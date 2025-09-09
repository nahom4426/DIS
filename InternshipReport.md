# Internship Report: Software Engineering Project (Extremely Detailed)

## 3. Experience and Transferrable Skill

### 3.1 Work Experience
#### 3.1.1 Technical Experience
During my internship, I developed and maintained a drug information and academic request management system using Vue.js and RESTful APIs. The project involved:
- Designing reusable Vue components (e.g., `DrugInformationRequestForm.vue`, `PendingRequests.vue`, `InquiryHistory.vue`, `AdminDashboard.vue`) for form input, data display, modals, and admin/superadmin management panels.
- Implementing state management using Vue's `ref`, `reactive`, and `computed` for dynamic UI updates. For example, in `DrugInformationRequestForm.vue`, the form data is managed with a `reactive` object, and computed properties are used to derive userUuid and other dynamic values. Admin and superadmin dashboards use computed properties to filter and aggregate data for reporting and management.
- Integrating with backend APIs using custom service modules (e.g., `questionApi.js`, `acadamicApi.js`, `adminApi.js`). API calls are made using methods like `submitAcademicRequest(userUuid, payload)`, `updateQuestion(questionUuid, data)`, and admin-specific endpoints such as `getAllUsers()` and `getAllInstitutions()`, with error handling and response parsing.
- Handling authentication and user state via a global store (`useAuthStore`). The store provides access to the current user's information and role, which is used for API requests, conditional rendering, and access control. Admins and superadmins have elevated permissions, which are checked in both frontend and backend.
- Managing form validation, error handling, and user feedback with custom logic and utility functions (e.g., `validateForm`, `toasted`). Validation checks for required fields, correct data types, and logical constraints before allowing submission. Admins and superadmins have additional validation for management actions (e.g., user creation, institution updates).
- Using slots and props for flexible component composition, such as passing table headers and rows to the `Table` component. This allows for reusable and customizable tables across different pages, including admin and superadmin views.
- Writing code for conditional rendering and dynamic form fields based on request type (patient-specific vs. academic) and user role (admin, superadmin, regular user). The form switches between different sets of fields and validation rules depending on the selected request type and user permissions.

**Example:**
In `AdminDashboard.vue`, admins can view all requests, manage users, and generate reports. Superadmins have access to institution management and system-wide settings. Role-based access control is enforced using route guards and conditional rendering:
```js
if (authStore.auth.role === 'admin' || authStore.auth.role === 'superadmin') {
  // Show admin/superadmin controls
}
```

#### 3.1.2 Non-Technical Experience
I participated in daily standups, sprint planning, and code reviews. I communicated requirements and blockers with my supervisor and team, and contributed to documentation and knowledge sharing. I learned to prioritize tasks, estimate effort, and adapt to changing requirements. I also contributed to onboarding new team members and helped maintain project documentation.

### 3.2 Benefits of Experience
- **Technical Growth:** I improved my understanding of component-based architecture, asynchronous programming, and API design. I learned to debug complex issues using browser dev tools and Vue's reactivity system. I became proficient in using Vue Devtools for inspecting component state and event flow. Working on admin and superadmin features deepened my knowledge of role-based access control and secure API design.
- **Practical Application:** I applied theoretical concepts from software engineering courses, such as separation of concerns, modularity, and design patterns, to real code. For example, I refactored API modules to follow a consistent structure and used design patterns for state management. Admin and superadmin modules required careful design to ensure security and maintainability.
- **Soft Skills:** My communication, teamwork, and problem-solving skills improved through collaboration and feedback. I learned to write clear commit messages, document code, and present my work in team meetings. Collaborating with admins and superadmins required clear communication and understanding of organizational policies.

### 3.3 Skills Gained
- **Practical Skills:**
  - Vue.js: Component lifecycle, reactivity, event handling, slots, props, custom directives.
  - JavaScript: ES6+, async/await, error handling, object manipulation, lodash utilities.
  - REST API: Axios-based service modules, authentication headers, error parsing, Swagger documentation, admin/superadmin endpoints.
  - Form validation: Custom logic for required fields, type checks, and user feedback. Example:
    ```js
    function validateForm() {
      const errors = [];
      if (!formData.requestType) errors.push('Please select a request type');
      // ...other checks...
      return errors;
    }
    ```
  - Responsive design: CSS grid, flexbox, media queries for mobile compatibility. Used TailwindCSS for utility-first styling.
  - Role-based access control: Implemented route guards and conditional rendering for admin/superadmin features.
- **Theoretical Knowledge:**
  - MVC and MVVM patterns in frontend development.
  - State management and data flow in single-page applications.
  - API contract design and documentation (Swagger).
  - Security principles for multi-role systems.
- **Team Playing Skills:**
  - Pair programming, code reviews, collaborative debugging.
  - Sharing reusable code and documentation.
  - Coordinating with admins and superadmins for system management.
- **Leadership Skills:**
  - Proposing architectural improvements (e.g., refactoring API modules for consistency).
  - Mentoring new team members on project structure and coding standards.
  - Supporting admins and superadmins in onboarding and training.

### 3.4 Challenges and Solutions
- **Technical Challenges:**
  - Integrating with inconsistent backend APIs (e.g., mismatched field names, missing data). Solution: Implemented mapping functions and added error handling for missing fields.
  - Debugging authentication and authorization flows. Solution: Used Vue Devtools and network inspector to trace login and token issues. Ensured admin/superadmin endpoints were protected and tested thoroughly.
  - Handling edge cases in form validation and submission. Solution: Wrote comprehensive validation logic and tested with various input scenarios, including admin/superadmin actions.
- **Personal Challenges:**
  - Adapting to remote work and asynchronous communication. Solution: Scheduled regular check-ins and used Slack for quick questions.
  - Managing multiple tasks and deadlines. Solution: Used Jira for task tracking and prioritized based on deadlines and dependencies.
- **Solutions:**
  - Implemented utility functions for data mapping and error handling.
  - Used Vue's devtools and browser console for step-by-step debugging.
  - Wrote clear documentation and code comments for future maintainers.
  - Regularly synced with team members, admins, and superadmins to clarify requirements and share progress.

---

## Part Two: Real World Project (SRS and System Design)

### 4. General Overview of the Project
The project is a web-based platform for managing drug information and academic requests. It enables healthcare professionals to submit detailed queries, track responses, and manage their profiles. The system is built with Vue.js for the frontend and a RESTful API backend documented with Swagger. The frontend communicates with the backend using service modules, and all data is validated and sanitized before submission. Admin and superadmin roles are integrated throughout the system for management and oversight.

### 4.1 Background of the Project
Healthcare providers often need timely, accurate drug information and academic support. Manual processes are slow and error-prone. This system automates request submission, tracking, and response, improving efficiency and record-keeping. The project was initiated to address the lack of a centralized platform for managing such requests.

### 4.2 Objective of the Project
#### 4.2.1 General Objective
To create a scalable, user-friendly platform for drug information and academic request management.
#### 4.2.2 Specific Objective
- Allow users to submit requests with patient and academic details.
- Enable specialists to respond and manage inquiries.
- Provide analytics and reporting for administrators.
- Ensure data security and privacy for sensitive medical information.

### 4.3 Statement of the Problem
Manual request management leads to delays, lost information, and poor communication. The project solves these issues by providing structured forms, automated tracking, and centralized data storage. The system also supports role-based access control to ensure only authorized users can view or respond to requests.

### 4.4 Methodology
Agile methodology was used, with two-week sprints, daily standups, and iterative development. The team used Vue.js for rapid UI prototyping and RESTful APIs for backend integration. Swagger was used for API documentation and testing. Code reviews and automated testing were performed to ensure quality and maintainability.

### 4.5 Development Tools
- **Frontend:** Vue.js, JavaScript, HTML, CSS, TailwindCSS
- **Backend:** RESTful API (Swagger, Node.js/Express or Spring Boot)
- **Version Control:** Git, GitHub
- **Collaboration:** VS Code, Slack, Jira
- **Testing:** Postman, Swagger UI, Jest for unit tests
- **Design:** Figma for UI mockups, Lucidchart for diagrams

### 4.6 Functional and Nonfunctional Requirements
- **Functional:**
  - User authentication and profile management
  - Submit drug/academic requests
  - View and respond to inquiries
  - Analytics dashboard
  - Role-based access control (admin, superadmin, user)
  - Notification system for new responses
  - Admin: Manage users, requests, generate reports
  - Superadmin: Manage institutions, system settings, audit logs
- **Nonfunctional:**
  - Security: JWT authentication, HTTPS, input validation, RBAC for admin/superadmin
  - Performance: Fast response times, efficient data loading
  - Usability: Responsive UI, clear error messages, accessibility
  - Scalability: Modular codebase, API versioning, cloud deployment

### 4.7 Use Case, Class Diagram, Sequence Diagram
- **Use Case Example:**
  - A doctor logs in, submits a drug information request via `DrugInformationRequestForm.vue`, which validates input and calls `submitDrugInformationRequest`. The backend processes the request and returns a response, which is displayed in the UI. The user can view the status of their request in `PendingRequests.vue` and receive notifications when a response is available.
  - An admin logs in, reviews all requests, manages users, and generates reports using `AdminDashboard.vue` and related API endpoints.
  - A superadmin logs in, manages institutions, configures system-wide settings, and audits logs using dedicated superadmin panels and endpoints.
- **Class Diagram:**
  - `User`: userUuid, firstName, email, role, profilePicture
  - `Request`: requestId, userUuid, description, patientInfo, status, urgency, createdAt, updatedAt
  - `Response`: responseId, requestId, answer, responder, createdAt
  - `Institution`: institutionId, name, admins, users (managed by superadmin)
- **Sequence Diagram:**
  1. User fills form and submits request
  2. Frontend validates and sends API call
  3. Backend creates request, returns confirmation
  4. Specialist responds, backend updates request
  5. Admin reviews and manages requests/users
  6. Superadmin manages institutions and system settings
  7. User views response in dashboard

**Code Example:**
```js
// In questionApi.js
export function updateQuestion(questionUuid, data) {
  return api
    .addAuthenticationHeader()
    .put(`/question/update/${questionUuid}`, data);
}
```

### 4.8 Database Design
- **Entities:**
  - User (userUuid, name, email, role, profilePicture)
  - Request (requestId, userUuid, description, patientInfo, status, urgency, createdAt, updatedAt)
  - Response (responseId, requestId, answer, responder, createdAt)
  - Institution (institutionId, name, admins, users (managed by superadmin))
  
- **Relationships:**
  - User has many Requests
  - Request has one Response
- **Indexes and Constraints:**
  - Unique indexes on userUuid and requestId
  - Foreign key constraints between Request and User, Response and Request

### 4.9 System Design (Component, Deployment, Block Diagram)
- **Component Diagram:**
  - Frontend: Vue components (forms, tables, modals, dashboard, profile, admin panels, superadmin panels)
  - Backend: API controllers, services, database models, admin/superadmin modules
- **Deployment Diagram:**
  - Web client (Vue.js) → API server → Database
  - Hosted on cloud infrastructure (e.g., AWS, Azure)
  - Admin and superadmin access via secure routes and endpoints
- **Block Diagram:**
  - User Interface ↔ API Service ↔ Database
  - Authentication Service ↔ User Interface
  - Admin/Superadmin Interface ↔ Management API ↔ Database

**Design Decisions:**
- Used Vue's composition API for better code organization and reusability.
- Modularized API calls into separate service files for maintainability, including admin and superadmin modules.
- Used environment variables for API endpoints and secrets.
- Implemented error boundaries and fallback UI for robustness.
- Enforced RBAC and secure access for admin/superadmin features.

---

## Part Three: Conclusion and Recommendation

### 5.1 Conclusion
My internship at [Name of the Organization] provided deep experience in full-stack software engineering. I learned to design, implement, and debug complex systems, and to work effectively in a team. I am grateful to my supervisor and colleagues for their support. The project gave me insight into real-world software development, including requirements gathering, iterative design, and production deployment. Working on admin and superadmin features taught me the importance of security, compliance, and scalable management in enterprise systems.

### 5.2 Recommendation
- **For Future Interns:**
  - Read and understand the codebase before starting. Explore key files like `DrugInformationRequestForm.vue`, `questionApi.js`, `PendingRequests.vue`, and admin/superadmin modules.
  - Communicate regularly with your team, admins, and superadmins. Use tools like Slack and Jira for updates and questions.
  - Document your work and share knowledge. Write clear comments and update project documentation, especially for management features.
  - Test your code thoroughly and handle edge cases, including admin/superadmin actions.
- **For Hosting Company:**
  - Provide clear onboarding and API documentation. Use Swagger for API contracts and document admin/superadmin endpoints.
  - Encourage code reviews and feedback. Set up automated testing and CI/CD pipelines for all roles.
- **For Department:**
  - Support hands-on projects and industry partnerships. Organize hackathons and workshops focused on multi-role systems.
- **For University:**
  - Integrate real-world projects and internships into the curriculum. Offer elective courses on modern frameworks, cloud deployment, and enterprise management systems.

---

## 6. Appendix
- Project reports (e.g., API documentation, SRS)
- Code samples (e.g., `DrugInformationRequestForm.vue`, `acadamicApi.js`, `PendingRequests.vue`, `InquiryHistory.vue`, `AdminDashboard.vue`, `adminApi.js`)
- Swagger API documentation screenshots
- Certificates of completion
- Database schema diagrams
- UI mockups and design files
- Deployment scripts and environment configuration
- Admin and superadmin workflow documentation

## 7. Reference
- Vue.js Documentation (https://vuejs.org/)
- Swagger API Docs (https://swagger.io/)
- GitHub Repository (link to project repo)
- [Name of the Organization] internal documentation
- Code comments and inline documentation in project files
- Figma design files
- Lucidchart diagrams
- Postman collections for API testing
- Admin and superadmin API documentation
