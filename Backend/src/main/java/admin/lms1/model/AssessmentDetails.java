package admin.lms1.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_details")
public class AssessmentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assessment_type")
    private String assessmentType;

    @Column(name = "assessment_name", unique = true)
    private String assessmentName;

    @Column(name = "number_of_questions")
    private Integer numberOfQuestions;

    @Column(name = "number_of_mcq")
    private Integer numberOfMcq;

    @Column(name = "number_of_programs")
    private Integer numberOfPrograms;

    @Column(name = "assessment_status")
    private String assessmentStatus;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "paper_added_on")
    private LocalDateTime paperAddedOn;

    @Column(name = "paper_added_status")
    private Integer paperAddedStatus;

    private Boolean status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", referencedColumnName = "employee_id", nullable = false)
    private Trainer trainer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", referencedColumnName = "id", nullable = false)
    private Admin manager;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAssessmentType() { return assessmentType; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }

    public String getAssessmentName() { return assessmentName; }
    public void setAssessmentName(String assessmentName) { this.assessmentName = assessmentName; }

    public Integer getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }

    public Integer getNumberOfMcq() { return numberOfMcq; }
    public void setNumberOfMcq(Integer numberOfMcq) { this.numberOfMcq = numberOfMcq; }

    public Integer getNumberOfPrograms() { return numberOfPrograms; }
    public void setNumberOfPrograms(Integer numberOfPrograms) { this.numberOfPrograms = numberOfPrograms; }

    public String getAssessmentStatus() { return assessmentStatus; }
    public void setAssessmentStatus(String assessmentStatus) { this.assessmentStatus = assessmentStatus; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getPaperAddedOn() { return paperAddedOn; }
    public void setPaperAddedOn(LocalDateTime paperAddedOn) { this.paperAddedOn = paperAddedOn; }

    public Integer getPaperAddedStatus() { return paperAddedStatus; }
    public void setPaperAddedStatus(Integer paperAddedStatus) { this.paperAddedStatus = paperAddedStatus; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public Trainer getTrainer() { return trainer; }
    public void setTrainer(Trainer trainer) { this.trainer = trainer; }

    public Admin getManager() { return manager; }
    public void setManager(Admin manager) { this.manager = manager; }
}