package admin.lms1.repository;

import admin.lms1.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrainerLoginRepository extends JpaRepository<Trainer, String> {
    Optional<Trainer> findByEmailAndEmployeeId(String email, String employeeId);
}
