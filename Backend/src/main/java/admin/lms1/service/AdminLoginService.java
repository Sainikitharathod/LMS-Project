package admin.lms1.service;

import admin.lms1.model.Admin;
import admin.lms1.repository.AdminLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminLoginService {

    @Autowired
    private AdminLoginRepository adminRepository;

    public boolean validateAdmin(String email, String empId) {
        Optional<Admin> admin = adminRepository.findByEmailAndEmpId(email, empId);
        return admin.isPresent();
    }
}

