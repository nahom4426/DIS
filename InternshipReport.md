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

The project is a comprehensive web-based platform for managing drug information and academic requests. The frontend is built with Vue.js, while the backend is developed using Spring Boot (Java) and PostgreSQL. This technology stack provides robust, scalable, and secure data management, supporting structured forms, centralized storage, analytics, and role-based access control (admin/superadmin). The system automates workflows that were previously manual, reducing delays and errors.

---

## 4.1 Background of the Project

Healthcare professionals require timely access to accurate drug information and academic resources. Manual requests are often inefficient, error-prone, and lack accountability. This project addressed these gaps by introducing a centralized, digital platform. The backend leverages Spring Boot for RESTful API development and PostgreSQL for reliable, ACID-compliant data storage. Spring Security is used for authentication and role-based access control, while JPA/Hibernate manages entity relationships and queries.

---

## 4.2 Objective of the Project

### 4.2.1 General Objective
To create a scalable, user-friendly platform for drug information and academic request management, using modern web and backend technologies.

### 4.2.2 Specific Objective
- Allow users to submit requests with patient and academic details via Vue.js forms, stored in PostgreSQL.
- Enable specialists to respond and manage inquiries through secure Spring Boot REST APIs.
- Provide analytics and reporting for administrators using backend queries and frontend dashboards.
- Ensure data security and privacy for sensitive medical information using Spring Security and PostgreSQL access controls.

---

## 4.3 Statement of the Problem for the Project

Manual request management leads to delays, lost information, and poor communication. The project solves these issues by providing structured forms (Vue.js), automated tracking (Spring Boot REST APIs), and centralized data storage (PostgreSQL). Role-based access (Spring Security) ensures proper security.

### Technical Implementation Details
- **Spring Boot REST API:** Handles all business logic, request validation, and response formatting. Controllers map HTTP endpoints to service methods, which interact with JPA repositories.
- **PostgreSQL Database:** Stores all entities (User, Request, Response, Institution) with referential integrity and transaction support. Indexes and constraints ensure fast queries and data consistency.
- **Spring Security:** Manages authentication (JWT tokens) and authorization (role-based access). Only authorized users can access admin/superadmin endpoints.
- **JPA/Hibernate:** Maps Java entities to PostgreSQL tables, supports complex queries, and manages relationships (e.g., User has many Requests).
- **Audit Logging:** All actions (create, update, delete) are logged for compliance and accountability.
- **Frontend Integration:** Vue.js communicates with Spring Boot APIs via Axios, sending and receiving JSON data. Form validation is performed on both frontend and backend.

### Example Entity (Java):
```java
@Entity
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;
    private String description;
    private String patientType;
    private String responseUrgency;
    @ManyToOne
    private User user;
    @OneToOne
    private Response answer;
    // getters and setters
}
```

### Example Repository (Java):
```java
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByUser_UserUuid(String userUuid);
}
```

### Example Controller (Java):
```java
@RestController
@RequestMapping("/question")
public class QuestionController {
    @GetMapping("/user/{userUuid}")
    public List<Request> getUserQuestions(@PathVariable String userUuid) {
        return requestRepository.findByUser_UserUuid(userUuid);
    }
}
```

### Example Security Configuration (Java):
```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/superadmin/**").hasRole("SUPERADMIN")
            .anyRequest().authenticated()
            .and()
            .oauth2ResourceServer().jwt();
    }
}
```

### Example Database Table (PostgreSQL):
```sql
CREATE TABLE request (
    request_id SERIAL PRIMARY KEY,
    description TEXT,
    patient_type VARCHAR(50),
    response_urgency VARCHAR(50),
    user_id INTEGER REFERENCES user(user_id),
    answer_id INTEGER REFERENCES response(response_id)
);
```

### Example Frontend API Call (Vue.js):
```js
export function getUserQuestions(userUuid) {
  return api.addAuthenticationHeader().get(`/question/user/${userUuid}`);
}
```

---

## Summary
By combining Vue.js, Spring Boot, and PostgreSQL, the project delivers a secure, scalable, and efficient solution for managing drug information and academic requests. The backend ensures robust data management, security, and compliance, while the frontend provides a user-friendly interface for all roles.

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
