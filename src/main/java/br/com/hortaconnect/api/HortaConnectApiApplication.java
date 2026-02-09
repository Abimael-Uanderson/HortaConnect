package br.com.hortaconnect.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HortaConnectApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(HortaConnectApiApplication.class, args);
	}

}
