package admin.lms1.mapper;

import admin.lms1.dto.AssessmentDetailsDTO;
import admin.lms1.dto.AdminDTO;
import admin.lms1.dto.TrainerDTO;
import admin.lms1.model.AssessmentDetails;
import org.springframework.stereotype.Component;

@Component
public class AssessmentMapper {

    public AssessmentDetailsDTO toDto(AssessmentDetails assessment) {
        AssessmentDetailsDTO dto = new AssessmentDetailsDTO();
        dto.setId(assessment.getId());
        dto.setAssessmentType(assessment.getAssessmentType());
        dto.setAssessmentName(assessment.getAssessmentName());
        dto.setNumberOfQuestions(assessment.getNumberOfQuestions());
        dto.setNumberOfMcq(assessment.getNumberOfMcq());
        dto.setNumberOfPrograms(assessment.getNumberOfPrograms());
        dto.setAssessmentStatus(assessment.getAssessmentStatus());
        dto.setCreatedBy(assessment.getCreatedBy());
        dto.setPaperAddedOn(assessment.getPaperAddedOn());
        dto.setPaperAddedStatus(assessment.getPaperAddedStatus());
        dto.setStatus(assessment.getStatus());

        // Map Trainer
        TrainerDTO trainerDTO = new TrainerDTO();
        trainerDTO.setEmployeeId(assessment.getTrainer().getEmployeeId());
        trainerDTO.setName(assessment.getTrainer().getName());
        trainerDTO.setEmail(assessment.getTrainer().getEmail());
        trainerDTO.setRole(assessment.getTrainer().getRole());
        trainerDTO.setCourse(assessment.getTrainer().getCourse());
        trainerDTO.setSubjects(assessment.getTrainer().getSubjects());
        trainerDTO.setStatus(assessment.getTrainer().getStatus());
        trainerDTO.setAddedOn(assessment.getTrainer().getAddedOn());
        dto.setTrainer(trainerDTO);

        // Map Admin
        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setEmpId(assessment.getManager().getEmpId());
        adminDTO.setName(assessment.getManager().getName());
        adminDTO.setEmail(assessment.getManager().getEmail());
        adminDTO.setRole(assessment.getManager().getRole());
        adminDTO.setStatus(assessment.getManager().getStatus());
        dto.setManager(adminDTO);

        return dto;
    }
}