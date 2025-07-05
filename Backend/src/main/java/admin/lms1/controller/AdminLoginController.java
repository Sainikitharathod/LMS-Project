package admin.lms1.controller;

import admin.lms1.model.AdminLogin;
import admin.lms1.service.AdminLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
@RequestMapping("/admin")


public class AdminLoginController {

    @Autowired
    private AdminLoginService adminLoginService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AdminLogin adminLogin) {
        boolean valid = adminLoginService.validateAdmin(adminLogin.getEmail(), adminLogin.getEmpId());
        if (valid) {
            return ResponseEntity.ok("Admin login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid admin credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Admin logged out successfully");
    }
}
