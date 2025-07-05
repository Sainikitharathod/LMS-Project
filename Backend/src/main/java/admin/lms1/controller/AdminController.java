package admin.lms1.controller;

import admin.lms1.model.Admin;
import admin.lms1.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Add a new admin
    @PostMapping("/add")
    public ResponseEntity<Admin> addAdmin(@RequestBody Admin admin) {
        Admin saved = adminService.saveAdmin(admin);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }


    // Check if empId exists
    @GetMapping("/exists/{empId}")
    public ResponseEntity<Boolean> isEmpIdExists(@PathVariable String empId) {
        boolean exists = adminService.isEmpIdExists(empId);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

    // Fetch admin by empId
    @GetMapping("/{empId}")
    public ResponseEntity<Admin> getAdminByEmpId(@PathVariable String empId) {
        Optional<Admin> adminOpt = adminService.getAdminByEmpId(empId);
        return adminOpt
                .map(admin -> new ResponseEntity<>(admin, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Authenticate admin by email, empId, name, and status
    @PostMapping("/authenticate")
    public ResponseEntity<Admin> authenticateAdmin(@RequestBody Admin credentials) {
        Optional<Admin> adminOpt = adminService.authenticateAdmin(
                credentials.getEmail(),
                credentials.getEmpId(),
                credentials.getName(),
                credentials.getStatus() != null ? credentials.getStatus().toString() : "1"
        );
        return adminOpt
                .map(admin -> new ResponseEntity<>(admin, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
    }

    // Get all admins (optional utility)
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    // Delete admin by empId (optional utility)
    @DeleteMapping("/{empId}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String empId) {
        if (!adminService.isEmpIdExists(empId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        adminService.deleteAdminByEmpId(empId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}