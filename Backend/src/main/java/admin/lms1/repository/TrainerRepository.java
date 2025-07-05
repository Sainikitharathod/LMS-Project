package admin.lms1.repository;

import admin.lms1.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, String> {
    Optional<Trainer> findByEmployeeId(String employeeId);
    List<Trainer> findByAdmin_EmpId(String adminEmpId);
    Optional<Trainer> findByEmployeeIdAndAdmin_EmpId(String employeeId, String adminEmpId);
    boolean existsByEmployeeId(String employeeId);
    void deleteByEmployeeId(String employeeId);
    void deleteByEmployeeIdAndAdmin_EmpId(String employeeId, String adminEmpId);
}
