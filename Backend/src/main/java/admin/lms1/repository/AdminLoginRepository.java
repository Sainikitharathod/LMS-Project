package admin.lms1.repository;

import admin.lms1.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminLoginRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmailAndEmpId(String email, String empId);
}
