package admin.lms1.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TrainerDTO {
    private String employeeId;
    private String name;
    private String email;
    private String role;
    private String course;
    private String subjects;
    private String status;  // Changed to String if needed
    private LocalDateTime addedOn;
}