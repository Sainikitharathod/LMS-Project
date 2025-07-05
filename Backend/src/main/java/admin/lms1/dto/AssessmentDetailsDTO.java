package admin.lms1.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AssessmentDetailsDTO {
    private Long id;
    private String assessmentType;
    private String assessmentName;
    private Integer numberOfQuestions;
    private Integer numberOfMcq;
    private Integer numberOfPrograms;
    private String assessmentStatus;
    private String createdBy;
    private LocalDateTime paperAddedOn;
    private Integer paperAddedStatus;
    private Boolean status;
    private TrainerDTO trainer;
    private AdminDTO manager;
}