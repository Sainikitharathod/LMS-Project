package admin.lms1.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_papers")
public class AssessmentPaper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = false)
    private Admin manager;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false, referencedColumnName = "employee_id")
    private Trainer trainer;

    @Column(name = "assessment_date")
    private LocalDateTime assessmentDate;

    @Column(name = "questions", columnDefinition = "TEXT")
    private String questions;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "assessment_name")
    private String assessmentName;

    @Column(name = "added_by")
    private String addedBy;

    @Column(name = "status")
    private Boolean status;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Admin getManager() { return manager; }
    public void setManager(Admin manager) { this.manager = manager; }
    public Trainer getTrainer() { return trainer; }
    public void setTrainer(Trainer trainer) { this.trainer = trainer; }
    public LocalDateTime getAssessmentDate() { return assessmentDate; }
    public void setAssessmentDate(LocalDateTime assessmentDate) { this.assessmentDate = assessmentDate; }
    public String getQuestions() { return questions; }
    public void setQuestions(String questions) { this.questions = questions; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getAssessmentName() { return assessmentName; }
    public void setAssessmentName(String assessmentName) { this.assessmentName = assessmentName; }
    public String getAddedBy() { return addedBy; }
    public void setAddedBy(String addedBy) { this.addedBy = addedBy; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    @Override
    public String toString() {
        return "AssessmentPaper{" +
               "id=" + id +
               ", manager=" + (manager != null ? manager.getEmpId() : "null") +
               ", trainer=" + (trainer != null ? trainer.getEmployeeId() : "null") +
               ", assessmentDate=" + assessmentDate +
               ", questions='" + questions + '\'' +
               ", courseName='" + courseName + '\'' +
               ", assessmentName='" + assessmentName + '\'' +
               ", addedBy='" + addedBy + '\'' +
               ", status=" + status +
               '}';
    }
}