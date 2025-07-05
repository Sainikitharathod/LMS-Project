package admin.lms1.service;

import admin.lms1.dto.AssessmentDetailsDTO;
import admin.lms1.mapper.AssessmentMapper;
import admin.lms1.model.AssessmentDetails;
import admin.lms1.model.Trainer;
import admin.lms1.model.Admin;
import admin.lms1.repository.AssessmentDetailsRepository;
import admin.lms1.repository.TrainerRepository;
import admin.lms1.repository.AdminRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssessmentDetailsService {

    private final AssessmentDetailsRepository assessmentRepository;
    private final TrainerRepository trainerRepository;
    private final AdminRepository adminRepository;
    private final AssessmentMapper mapper;

    public AssessmentDetailsService(
            AssessmentDetailsRepository assessmentRepository,
            TrainerRepository trainerRepository,
            AdminRepository adminRepository,
            AssessmentMapper mapper) {
        this.assessmentRepository = assessmentRepository;
        this.trainerRepository = trainerRepository;
        this.adminRepository = adminRepository;
        this.mapper = mapper;
    }

    // Create Assessment (returns DTO)
    public AssessmentDetailsDTO createAssessment(AssessmentDetails assessment) {
        // Fetch and validate Trainer/Admin
        Trainer trainer = trainerRepository.findByEmployeeId(assessment.getTrainer().getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
        Admin admin = adminRepository.findByEmpId(assessment.getManager().getEmpId())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        assessment.setTrainer(trainer);
        assessment.setManager(admin);
        AssessmentDetails savedAssessment = assessmentRepository.save(assessment);
        return mapper.toDto(savedAssessment);
    }

    // Get All Assessments (returns DTO list)
    public List<AssessmentDetailsDTO> getAllAssessments() {
        return assessmentRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    // Get Assessment by ID (returns DTO)
    public AssessmentDetailsDTO getAssessmentById(Long id) {
        return assessmentRepository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));
    }

    // Get Assessments by Trainer ID (returns DTO list)
    public List<AssessmentDetailsDTO> getAssessmentsByTrainer(String employeeId) {
        return assessmentRepository.findByTrainerEmployeeId(employeeId)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    // Update Assessment (returns DTO)
    public AssessmentDetailsDTO updateAssessment(Long id, AssessmentDetails updatedAssessment) {
        AssessmentDetails existing = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));

        // Fetch and validate Trainer/Admin
        Trainer trainer = trainerRepository.findByEmployeeId(updatedAssessment.getTrainer().getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
        Admin admin = adminRepository.findByEmpId(updatedAssessment.getManager().getEmpId())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        // Update fields
        existing.setTrainer(trainer);
        existing.setManager(admin);
        existing.setAssessmentType(updatedAssessment.getAssessmentType());
        existing.setAssessmentName(updatedAssessment.getAssessmentName());
        existing.setNumberOfQuestions(updatedAssessment.getNumberOfQuestions());
        existing.setNumberOfMcq(updatedAssessment.getNumberOfMcq());
        existing.setNumberOfPrograms(updatedAssessment.getNumberOfPrograms());
        existing.setAssessmentStatus(updatedAssessment.getAssessmentStatus());
        existing.setCreatedBy(updatedAssessment.getCreatedBy());
        existing.setPaperAddedOn(updatedAssessment.getPaperAddedOn());
        existing.setPaperAddedStatus(updatedAssessment.getPaperAddedStatus());
        existing.setStatus(updatedAssessment.getStatus());

        AssessmentDetails updated = assessmentRepository.save(existing);
        return mapper.toDto(updated);
    }

    // Delete Assessment
    public void deleteAssessment(Long id) {
        if (!assessmentRepository.existsById(id)) {
            throw new RuntimeException("Assessment not found with id: " + id);
        }
        assessmentRepository.deleteById(id);
    }
}