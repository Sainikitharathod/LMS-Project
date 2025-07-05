package admin.lms1.repository;

import admin.lms1.model.Admin;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Already covered by JpaRepository's findById(String empId), but fine to keep
    Optional<Admin> findByEmpId(String empId);

    // Lookup by email
    Optional<Admin> findByEmail(String email);

    // Check if admin exists by empId
    boolean existsByEmpId(String empId);

    // Check if admin exists by email
    boolean existsByEmail(String email);
}
