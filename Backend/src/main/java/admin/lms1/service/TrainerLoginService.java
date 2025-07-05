package admin.lms1.service;

import admin.lms1.repository.TrainerLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import admin.lms1.model.Trainer;

@Service
public class TrainerLoginService {

    @Autowired
    private TrainerLoginRepository trainerRepository;

    public boolean validateTrainer(String email, String trainerId) {
        Optional<Trainer> trainer = trainerRepository.findByEmailAndEmployeeId(email, trainerId);
        return trainer.isPresent();
    }
}
