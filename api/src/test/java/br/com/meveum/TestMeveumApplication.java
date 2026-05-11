package br.com.meveum;

import org.springframework.boot.SpringApplication;

public class TestMeveumApplication {

	public static void main(String[] args) {
		SpringApplication.from(MeveumApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
