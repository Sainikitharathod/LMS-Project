package admin.lms1.controller;

import admin.lms1.model.AssessmentPaper;
import admin.lms1.service.AssessmentPaperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessment-papers")
@CrossOrigin(origins = "http://localhost:3000")  // remove or specify origin in production
public class AssessmentPaperController {

    private final AssessmentPaperService service;

    public AssessmentPaperController(AssessmentPaperService service) {
        this.service = service;
    }

    // Create
    @PostMapping
    public ResponseEntity<AssessmentPaper> createAssessmentPaper(@RequestBody AssessmentPaper paper) {
        return ResponseEntity.ok(service.createAssessmentPaper(paper));
    }

    // Get All
    @GetMapping
    public ResponseEntity<List<AssessmentPaper>> getAllAssessmentPapers() {
        return ResponseEntity.ok(service.getAllAssessmentPapers());
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<AssessmentPaper> getAssessmentPaperById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAssessmentPaperById(id));
    }

    // Get by Trainer's employeeId
    @GetMapping("/trainer/{employeeId}")
    public ResponseEntity<List<AssessmentPaper>> getAssessmentPapersByTrainer(@PathVariable String employeeId) {
        return ResponseEntity.ok(service.getAssessmentPapersByTrainer(employeeId));
    }

    // Get by Manager's empId
    @GetMapping("/manager/{empId}")
    public ResponseEntity<List<AssessmentPaper>> getAssessmentPapersByManager(@PathVariable String empId) {
        return ResponseEntity.ok(service.getAssessmentPapersByManager(empId));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<AssessmentPaper> updateAssessmentPaper(@PathVariable Long id,
                                                                 @RequestBody AssessmentPaper paper) {
        return ResponseEntity.ok(service.updateAssessmentPaper(id, paper));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessmentPaper(@PathVariable Long id) {
        service.deleteAssessmentPaper(id);
        return ResponseEntity.noContent().build();
    }
}
