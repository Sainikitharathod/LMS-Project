package admin.lms1.model;

public class TrainerLogin {
    private String email;
    private String trainerId; // Corresponds to employeeId in Trainer entity

    // Getters and setters
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getTrainerId() {
        return trainerId;
    }
    public void setTrainerId(String trainerId) {
        this.trainerId = trainerId;
    }
}
