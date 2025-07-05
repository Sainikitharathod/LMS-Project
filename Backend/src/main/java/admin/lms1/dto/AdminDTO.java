package admin.lms1.dto;

import lombok.Data;

@Data
public class AdminDTO {
    private Long serialNumber;
    private String empId;
    private String name;
    private String email;
    private String role;
    private Integer status;
}