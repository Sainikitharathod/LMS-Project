package admin.lms1.controller;

import admin.lms1.model.Trainer;
import admin.lms1.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    // Add single trainer with adminEmpId in path
    @PostMapping("/admin/{adminEmpId}/add")
    public ResponseEntity<?> addTrainer(@PathVariable String adminEmpId, @RequestBody Trainer trainer) {
        try {
            Trainer savedTrainer = trainerService.saveTrainer(adminEmpId, trainer);
            return new ResponseEntity<>(savedTrainer, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Add multiple trainers with adminEmpId in path
    @PostMapping("/admin/{adminEmpId}/addMultiple")
    public ResponseEntity<List<Trainer>> addMultipleTrainers(
            @PathVariable String adminEmpId,
            @RequestBody List<Trainer> trainers) {

        List<Trainer> savedTrainers = new ArrayList<>();
        for (Trainer trainer : trainers) {
            Trainer saved = trainerService.saveTrainer(adminEmpId, trainer);
            savedTrainers.add(saved);
        }
        return ResponseEntity.ok(savedTrainers);
    }

    @GetMapping("/exists/{employeeId}")
    public ResponseEntity<Boolean> isEmployeeIdExists(@PathVariable String employeeId) {
        boolean exists = trainerService.isEmployeeIdExists(employeeId);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<Trainer> getTrainerByEmployeeId(@PathVariable String employeeId) {
        Optional<Trainer> trainerOpt = trainerService.getTrainerByEmployeeId(employeeId);
        return trainerOpt
                .map(trainer -> new ResponseEntity<>(trainer, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        List<Trainer> trainers = trainerService.getAllTrainers();
        return new ResponseEntity<>(trainers, HttpStatus.OK);
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable String employeeId) {
        try {
            trainerService.deleteTrainerByEmployeeId(employeeId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/admin/{adminEmpId}")
    public ResponseEntity<List<Trainer>> getTrainersByAdminEmpId(@PathVariable String adminEmpId) {
        List<Trainer> trainers = trainerService.getTrainersByAdminEmpId(adminEmpId);
        if (trainers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(trainers, HttpStatus.OK);
    }

    @GetMapping("/admin/{adminEmpId}/trainer/{employeeId}")
    public ResponseEntity<Trainer> getTrainerByAdminAndEmployeeId(
            @PathVariable String adminEmpId,
            @PathVariable String employeeId) {

        Optional<Trainer> trainerOpt = trainerService.getTrainerByAdminAndEmployeeId(adminEmpId, employeeId);
        return trainerOpt
                .map(trainer -> new ResponseEntity<>(trainer, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/admin/{adminEmpId}/trainer/{employeeId}")
    public ResponseEntity<Trainer> editTrainerByAdminAndEmployeeId(
            @PathVariable String adminEmpId,
            @PathVariable String employeeId,
            @RequestBody Trainer updatedTrainer) {

        Optional<Trainer> editedTrainer = trainerService.editTrainerByAdminAndEmployeeId(adminEmpId, employeeId, updatedTrainer);
        return editedTrainer
                .map(trainer -> new ResponseEntity<>(trainer, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/admin/{adminEmpId}/trainer/{employeeId}")
    public ResponseEntity<Void> deleteTrainerByAdminAndEmployeeId(
            @PathVariable String adminEmpId,
            @PathVariable String employeeId) {

        boolean deleted = trainerService.deleteTrainerByAdminAndEmployeeId(adminEmpId, employeeId);
        return deleted
                ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
