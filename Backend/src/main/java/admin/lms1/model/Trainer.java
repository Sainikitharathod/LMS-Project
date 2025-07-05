package admin.lms1.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainer")
public class Trainer {

    @Id
    @Column(name = "employee_id", nullable = false, unique = true)
    private String employeeId; // Primary Key

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "role")
    private String role;

    @Column(name = "course")
    private String course;

    @Column(name = "subjects")
    private String subjects;

    @Column(name = "status", columnDefinition = "varchar(1) default '1'")
    private String status = "1"; // Default to active

    @Column(name = "added_on")
    private LocalDateTime addedOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_empid", referencedColumnName = "emp_id")
    private Admin admin; // Foreign key to Admin

    @Column(name = "id", insertable = false, updatable = false)
    private Long serialNumber;

    // No-arg constructor required by JPA
    public Trainer() {
        this.addedOn = LocalDateTime.now();
    }

    // Getters and setters...

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public Long getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(Long serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSubjects() {
        return subjects;
    }

    public void setSubjects(String subjects) {
        this.subjects = subjects;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAddedOn() {
        return addedOn;
    }

    public void setAddedOn(LocalDateTime addedOn) {
        this.addedOn = addedOn;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
}
