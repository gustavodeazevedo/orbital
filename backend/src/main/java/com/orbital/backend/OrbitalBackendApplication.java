/*
 * Classe principal do backend.
 * Inicia a aplicacao Spring.
 */
/*
 * Quando o backend sobe, esta classe e o ponto de partida.
 * Ela carrega as configuracoes e deixa tudo pronto para rodar.
 */
package com.orbital.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrbitalBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrbitalBackendApplication.class, args);
    }
}
