package admin.lms1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "admin.lms1.model")
public class Lms1Application {

	public static void main(String[] args) {
		SpringApplication.run(Lms1Application.class, args);
	}

}
