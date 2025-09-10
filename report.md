
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