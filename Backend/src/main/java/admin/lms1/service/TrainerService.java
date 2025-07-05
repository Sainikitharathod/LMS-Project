package admin.lms1.service;

import admin.lms1.model.Admin;
import admin.lms1.model.Trainer;
import admin.lms1.repository.AdminRepository;
import admin.lms1.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Trainer saveTrainer(String adminEmpId, Trainer trainer) {
        trainer.setAddedOn(LocalDateTime.now());

        Admin admin = adminRepository.findByEmpId(adminEmpId)
                .orElseThrow(() -> new RuntimeException("Admin not found with empId: " + adminEmpId));
        trainer.setAdmin(admin);

        return trainerRepository.save(trainer);
    }

    public boolean isEmployeeIdExists(String employeeId) {
        return trainerRepository.existsByEmployeeId(employeeId);
    }

    public Optional<Trainer> getTrainerByEmployeeId(String employeeId) {
        return trainerRepository.findByEmployeeId(employeeId);
    }

    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    @Transactional
    public void deleteTrainerByEmployeeId(String employeeId) {
        Optional<Trainer> trainerOpt = trainerRepository.findByEmployeeId(employeeId);
        if (trainerOpt.isPresent()) {
            trainerRepository.delete(trainerOpt.get());
        } else {
            throw new RuntimeException("Trainer with employeeId " + employeeId + " not found.");
        }
    }

    public List<Trainer> getTrainersByAdminEmpId(String adminEmpId) {
        return trainerRepository.findByAdmin_EmpId(adminEmpId);
    }

    public Optional<Trainer> getTrainerByAdminAndEmployeeId(String adminEmpId, String employeeId) {
        return trainerRepository.findByEmployeeIdAndAdmin_EmpId(employeeId, adminEmpId);
    }

    public Optional<Trainer> editTrainerByAdminAndEmployeeId(String adminEmpId, String employeeId, Trainer updatedTrainer) {
        Optional<Trainer> trainerOpt = trainerRepository.findByEmployeeIdAndAdmin_EmpId(employeeId, adminEmpId);
        if (trainerOpt.isPresent()) {
            Trainer trainer = trainerOpt.get();
            trainer.setName(updatedTrainer.getName());
            trainer.setEmail(updatedTrainer.getEmail());
            trainer.setRole(updatedTrainer.getRole());
            trainer.setCourse(updatedTrainer.getCourse());
            trainer.setSubjects(updatedTrainer.getSubjects());
            trainer.setStatus(updatedTrainer.getStatus());
            trainer.setAddedOn(LocalDateTime.now());
            return Optional.of(trainerRepository.save(trainer));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deleteTrainerByAdminAndEmployeeId(String adminEmpId, String employeeId) {
        Optional<Trainer> trainerOpt = trainerRepository.findByEmployeeIdAndAdmin_EmpId(employeeId, adminEmpId);
        if (trainerOpt.isPresent()) {
            trainerRepository.delete(trainerOpt.get());
            return true;
        }
        return false;
    }
}
