package admin.lms1.controller;

import admin.lms1.model.TrainerLogin;
import admin.lms1.service.TrainerLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/trainer")

public class TrainerLoginController {

    @Autowired
    private TrainerLoginService trainerLoginService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody TrainerLogin trainerLogin) {
        boolean valid = trainerLoginService.validateTrainer(trainerLogin.getEmail(), trainerLogin.getTrainerId());
        if (valid) {
            return ResponseEntity.ok("Trainer login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid trainer credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Trainer logged out successfully");
    }
}
