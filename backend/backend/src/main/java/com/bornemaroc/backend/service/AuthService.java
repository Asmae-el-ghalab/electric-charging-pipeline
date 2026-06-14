package com.bornemaroc.backend.service;

import com.bornemaroc.backend.config.JwtUtil;
import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.enums.RoleUtilisateur;
import com.bornemaroc.backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register
    public Utilisateur register(String nom, String email,
                                String motDePasse, String vehicule) {
        if (utilisateurRepository.existsByEmail(email)) {
            throw new RuntimeException("Email kayen déjà!");
        }

        Conducteur conducteur = new Conducteur();
        conducteur.setNom(nom);
        conducteur.setEmail(email);
        // Bcrypt → encrypt password
        conducteur.setMotDePasse(
                passwordEncoder.encode(motDePasse)
        );
        conducteur.setVehicule(vehicule);
        conducteur.setDateInscription(new Date());
        conducteur.setRole(RoleUtilisateur.CONDUCTEUR);
        conducteur.setEstBloque(false);

        return utilisateurRepository.save(conducteur);
    }

    // Login → return token
    public Map<String, String> login(String email,
                                     String motDePasse) {
        Utilisateur utilisateur = utilisateurRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Email mkaynach!")
                );

        // Check password bcrypt
        if (!passwordEncoder.matches(
                motDePasse,
                utilisateur.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect!");
        }

        // Générer token
        String token = jwtUtil.generateToken(
                utilisateur.getEmail(),
                utilisateur.getRole().name()
        );

        // Return token + info
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", utilisateur.getEmail());
        response.put("role", utilisateur.getRole().name());
        response.put("nom", utilisateur.getNom());

        return response;
    }
}