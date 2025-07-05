
package admin.lms1.service;

import admin.lms1.model.AssessmentPaper;
import admin.lms1.model.Admin;
import admin.lms1.model.Trainer;
import admin.lms1.repository.AssessmentPaperRepository;
import admin.lms1.repository.AdminRepository;
import admin.lms1.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import java.util.List;
import java.util.Optional;

@Service
public class AssessmentPaperService {

    private final AssessmentPaperRepository assessmentPaperRepository;
    private final AdminRepository adminRepository;
    private final TrainerRepository trainerRepository;

    @Autowired
    public AssessmentPaperService(
            AssessmentPaperRepository assessmentPaperRepository,
            AdminRepository adminRepository,
            TrainerRepository trainerRepository
    ) {
        this.assessmentPaperRepository = assessmentPaperRepository;
        this.adminRepository = adminRepository;
        this.trainerRepository = trainerRepository;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public AssessmentPaper createAssessmentPaper(AssessmentPaper paper) {
        try {
            System.out.println("Creating AssessmentPaper with payload: " + paper);
            // Validate payload
            if (paper.getManager() == null || paper.getManager().getEmpId() == null) {
                System.err.println("Invalid payload: manager or empId is null");
                throw new IllegalArgumentException("Manager empId cannot be null.");
            }
            if (paper.getTrainer() == null || paper.getTrainer().getEmployeeId() == null) {
                System.err.println("Invalid payload: trainer or employeeId is null");
                throw new IllegalArgumentException("Trainer employeeId cannot be null.");
            }
            if (paper.getCourseName() == null || paper.getAssessmentName() == null) {
                System.err.println("Invalid payload: courseName or assessmentName is null");
                throw new IllegalArgumentException("Course name and assessment name cannot be null.");
            }

            // Fetch manager by empId
            Optional<Admin> managerOpt = adminRepository.findByEmpId(paper.getManager().getEmpId());
            if (!managerOpt.isPresent()) {
                System.err.println("Manager not found for empId: " + paper.getManager().getEmpId());
                throw new IllegalArgumentException("Manager with empId " + paper.getManager().getEmpId() + " not found.");
            }

            // Fetch trainer by employeeId
            Optional<Trainer> trainerOpt = trainerRepository.findByEmployeeId(paper.getTrainer().getEmployeeId());
            if (!trainerOpt.isPresent()) {
                System.err.println("Trainer not found for employeeId: " + paper.getTrainer().getEmployeeId());
                throw new IllegalArgumentException("Trainer with employeeId " + paper.getTrainer().getEmployeeId() + " not found.");
            }

            // Set the fetched entities
            paper.setManager(managerOpt.get());
            paper.setTrainer(trainerOpt.get());

            // Ensure non-null values for optional fields
            if (paper.getAddedBy() == null) {
                paper.setAddedBy("Unknown");
                System.out.println("Set default addedBy: Unknown");
            }
            if (paper.getStatus() == null) {
                paper.setStatus(true);
                System.out.println("Set default status: true");
            }

            // Save and flush to ensure persistence
            AssessmentPaper savedPaper = assessmentPaperRepository.save(paper);
            assessmentPaperRepository.flush();
            System.out.println("Saved AssessmentPaper with ID: " + savedPaper.getId());
            return savedPaper;
        } catch (Exception e) {
            System.err.println("Error saving AssessmentPaper: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save AssessmentPaper: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<AssessmentPaper> getAllAssessmentPapers() {
        System.out.println("Fetching all AssessmentPapers");
        List<AssessmentPaper> papers = assessmentPaperRepository.findAll();
        System.out.println("Retrieved " + papers.size() + " AssessmentPapers");
        return papers;
    }

    @Transactional(readOnly = true)
    public AssessmentPaper getAssessmentPaperById(Long id) {
        System.out.println("Fetching AssessmentPaper with ID: " + id);
        AssessmentPaper paper = assessmentPaperRepository.findById(id)
                .orElseThrow(() -> {
                    System.err.println("AssessmentPaper with id " + id + " not found.");
                    return new IllegalArgumentException("AssessmentPaper with id " + id + " not found.");
                });
        System.out.println("Retrieved AssessmentPaper: " + paper.getId());
        return paper;
    }

    @Transactional(readOnly = true)
    public List<AssessmentPaper> getAssessmentPapersByTrainer(String employeeId) {
        System.out.println("Fetching AssessmentPapers for trainer: " + employeeId);
        List<AssessmentPaper> papers = assessmentPaperRepository.findByTrainerEmployeeId(employeeId);
        System.out.println("Retrieved " + papers.size() + " AssessmentPapers for trainer: " + employeeId);
        return papers;
    }

    @Transactional(readOnly = true)
    public List<AssessmentPaper> getAssessmentPapersByManager(String empId) {
        System.out.println("Fetching AssessmentPapers for manager: " + empId);
        List<AssessmentPaper> papers = assessmentPaperRepository.findByManagerEmpId(empId);
        System.out.println("Retrieved " + papers.size() + " AssessmentPapers for manager: " + empId);
        return papers;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public AssessmentPaper updateAssessmentPaper(Long id, AssessmentPaper paper) {
        try {
            System.out.println("Updating AssessmentPaper with ID: " + id);
            AssessmentPaper existingPaper = getAssessmentPaperById(id);

            // Validate payload
            if (paper.getManager() == null || paper.getManager().getEmpId() == null) {
                System.err.println("Invalid payload: manager or empId is null");
                throw new IllegalArgumentException("Manager empId cannot be null.");
            }
            if (paper.getTrainer() == null || paper.getTrainer().getEmployeeId() == null) {
                System.err.println("Invalid payload: trainer or employeeId is null");
                throw new IllegalArgumentException("Trainer employeeId cannot be null.");
            }
            if (paper.getCourseName() == null || paper.getAssessmentName() == null) {
                System.err.println("Invalid payload: courseName or assessmentName is null");
                throw new IllegalArgumentException("Course name and assessment name cannot be null.");
            }

            // Fetch manager by empId
            Optional<Admin> managerOpt = adminRepository.findByEmpId(paper.getManager().getEmpId());
            if (!managerOpt.isPresent()) {
                System.err.println("Manager not found for empId: " + paper.getManager().getEmpId());
                throw new IllegalArgumentException("Manager with empId " + paper.getManager().getEmpId() + " not found.");
            }

            // Fetch trainer by employeeId
            Optional<Trainer> trainerOpt = trainerRepository.findByEmployeeId(paper.getTrainer().getEmployeeId());
            if (!trainerOpt.isPresent()) {
                System.err.println("Trainer not found for employeeId: " + paper.getTrainer().getEmployeeId());
                throw new IllegalArgumentException("Trainer with employeeId " + paper.getTrainer().getEmployeeId() + " not found.");
            }

            // Update fields
            existingPaper.setManager(managerOpt.get());
            existingPaper.setTrainer(trainerOpt.get());
            existingPaper.setAssessmentDate(paper.getAssessmentDate());
            existingPaper.setQuestions(paper.getQuestions());
            existingPaper.setCourseName(paper.getCourseName());
            existingPaper.setAssessmentName(paper.getAssessmentName());
            existingPaper.setAddedBy(paper.getAddedBy() != null ? paper.getAddedBy() : "Unknown");
            existingPaper.setStatus(paper.getStatus() != null ? paper.getStatus() : true);

            // Save and flush
            AssessmentPaper updatedPaper = assessmentPaperRepository.save(existingPaper);
            assessmentPaperRepository.flush();
            System.out.println("Updated AssessmentPaper with ID: " + updatedPaper.getId());
            return updatedPaper;
        } catch (Exception e) {
            System.err.println("Error updating AssessmentPaper: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update AssessmentPaper: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteAssessmentPaper(Long id) {
        try {
            System.out.println("Deleting AssessmentPaper with ID: " + id);
            if (!assessmentPaperRepository.existsById(id)) {
                System.err.println("AssessmentPaper with id " + id + " not found.");
                throw new IllegalArgumentException("AssessmentPaper with id " + id + " not found.");
            }
            assessmentPaperRepository.deleteById(id);
            assessmentPaperRepository.flush();
            System.out.println("Deleted AssessmentPaper with ID: " + id);
        } catch (Exception e) {
            System.err.println("Error deleting AssessmentPaper: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete AssessmentPaper: " + e.getMessage(), e);
        }
    }
}
