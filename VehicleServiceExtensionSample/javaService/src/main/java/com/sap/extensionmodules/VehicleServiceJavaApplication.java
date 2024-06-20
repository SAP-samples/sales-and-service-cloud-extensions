package com.sap.extensionmodules;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
public class VehicleServiceJavaApplication {

	public static void main(String[] args) {
		SpringApplication.run(VehicleServiceJavaApplication.class, args);
	}

}
