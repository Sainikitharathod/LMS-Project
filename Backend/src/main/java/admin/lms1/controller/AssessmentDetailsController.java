package admin.lms1.controller;

import admin.lms1.dto.AssessmentDetailsDTO;
import admin.lms1.model.AssessmentDetails;
import admin.lms1.service.AssessmentDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssessmentDetailsController {

    private final AssessmentDetailsService service;

    public AssessmentDetailsController(AssessmentDetailsService service) {
        this.service = service;
    }

    // Create Assessment
    @PostMapping
    public ResponseEntity<AssessmentDetailsDTO> createAssessment(@RequestBody AssessmentDetails assessment) {
        AssessmentDetailsDTO saved = service.createAssessment(assessment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Get All Assessments
    @GetMapping
    public ResponseEntity<List<AssessmentDetailsDTO>> getAllAssessments() {
        return ResponseEntity.ok(service.getAllAssessments());
    }

    // Get Assessment by ID
    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDetailsDTO> getAssessmentById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAssessmentById(id));
    }

    // Get Assessments by Trainer ID
    @GetMapping("/trainer/{employeeId}")
    public ResponseEntity<List<AssessmentDetailsDTO>> getAssessmentsByTrainer(@PathVariable String employeeId) {
        return ResponseEntity.ok(service.getAssessmentsByTrainer(employeeId));
    }

    // Update Assessment
    @PutMapping("/{id}")
    public ResponseEntity<AssessmentDetailsDTO> updateAssessment(
            @PathVariable Long id,
            @RequestBody AssessmentDetails assessment) {
        return ResponseEntity.ok(service.updateAssessment(id, assessment));
    }

    // Delete Assessment
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssessment(@PathVariable Long id) {
        service.deleteAssessment(id);
        return ResponseEntity.ok("Assessment deleted successfully");
    }
}