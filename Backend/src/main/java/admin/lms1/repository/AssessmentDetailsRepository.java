package admin.lms1.repository;

import admin.lms1.model.AssessmentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentDetailsRepository extends JpaRepository<AssessmentDetails, Long> {
    List<AssessmentDetails> findByTrainerEmployeeId(String employeeId);
}
