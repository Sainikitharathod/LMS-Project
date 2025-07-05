package admin.lms1.service;

import admin.lms1.model.Admin;
import admin.lms1.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Save or update an admin
    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // Check if empId exists
    public boolean isEmpIdExists(String empId) {
        return adminRepository.existsByEmpId(empId);
    }

    // Get admin by empId (primary key)
    public Optional<Admin> getAdminByEmpId(String empId) {
        return adminRepository.findByEmpId(empId);
    }

    // Authenticate admin using multiple fields (simplified for example)
    public Optional<Admin> authenticateAdmin(String email, String empId, String name, String status) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        return adminOpt.filter(admin ->
            admin.getEmpId().equals(empId) &&
            admin.getName().equalsIgnoreCase(name) &&
            admin.getStatus().toString().equals(status)
        );
    }

    // Optional: Get all admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void deleteAdminByEmpId(String empId) {
        Optional<Admin> adminOpt = adminRepository.findByEmpId(empId);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            adminRepository.deleteById(admin.getSerialNumber());  // Use the Long id here
        } else {
            // Handle not found case if needed (optional)
            // throw new RuntimeException("Admin not found with empId: " + empId);
        }
    }
}

