package com.eventbooking.eventbooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class EventbookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventbookingApplication.class, args);
	}

}
