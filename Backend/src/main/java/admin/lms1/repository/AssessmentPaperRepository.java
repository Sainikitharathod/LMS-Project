package admin.lms1.repository;

import admin.lms1.model.AssessmentPaper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentPaperRepository extends JpaRepository<AssessmentPaper, Long> {
    List<AssessmentPaper> findByTrainerEmployeeId(String employeeId);
    List<AssessmentPaper> findByManagerEmpId(String empId);
}