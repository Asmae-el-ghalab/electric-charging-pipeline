package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.enums.RoleUtilisateur;
import com.bornemaroc.backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Récupérer tous les utilisateurs
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    // Récupérer un utilisateur par ID
    public Utilisateur getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur non trouvé avec l'id: " + id)
                );
    }

    // Récupérer un utilisateur par email
    public Utilisateur getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur non trouvé avec l'email: " + email)
                );
    }

    // Créer un utilisateur depuis l'admin ou l'inscription
    @Transactional
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {

        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        // Crypter le mot de passe avec BCrypt avant save()
        utilisateur.setMotDePasse(
                passwordEncoder.encode(utilisateur.getMotDePasse())
        );

        // Valeurs par défaut
        if (utilisateur.getRole() == null) {
            utilisateur.setRole(RoleUtilisateur.CONDUCTEUR);
        }

        if (utilisateur.getEstBloque() == null) {
            utilisateur.setEstBloque(false);
        }

        if (utilisateur.getTypeUtilisateur() == null) {
            utilisateur.setTypeUtilisateur("conducteur");
        }

        if (utilisateur.getDtype() == null) {
            utilisateur.setDtype("conducteur");
        }

        if (utilisateur.getNiveauAcces() == null) {
            utilisateur.setNiveauAcces(1);
        }

        return utilisateurRepository.save(utilisateur);
    }

    /*
     * Cette méthode est optionnelle.
     * Ton Controller utilise createUtilisateur() pour /register,
     * mais tu peux la garder pour une future utilisation.
     */
    @Transactional
    public Utilisateur register(Utilisateur utilisateur) {

        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        utilisateur.setRole(RoleUtilisateur.CONDUCTEUR);
        utilisateur.setNiveauAcces(1);
        utilisateur.setTypeUtilisateur("conducteur");
        utilisateur.setDtype("conducteur");
        utilisateur.setEstBloque(false);

        utilisateur.setMotDePasse(
                passwordEncoder.encode(utilisateur.getMotDePasse())
        );

        return utilisateurRepository.save(utilisateur);
    }

    // Mettre à jour un utilisateur
    @Transactional
    public Utilisateur updateUtilisateur(Long id, Utilisateur utilisateurDetails) {
        Utilisateur utilisateur = getUtilisateurById(id);

        utilisateur.setNom(utilisateurDetails.getNom());
        utilisateur.setEmail(utilisateurDetails.getEmail());
        utilisateur.setVehicule(utilisateurDetails.getVehicule());
        utilisateur.setTypePrise(utilisateurDetails.getTypePrise());
        utilisateur.setTypeUtilisateur(utilisateurDetails.getTypeUtilisateur());

        return utilisateurRepository.save(utilisateur);
    }

    // Bloquer un utilisateur
    @Transactional
    public Utilisateur bloquerUtilisateur(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateur.setEstBloque(true);
        return utilisateurRepository.save(utilisateur);
    }

    // Débloquer un utilisateur
    @Transactional
    public Utilisateur debloquerUtilisateur(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateur.setEstBloque(false);
        return utilisateurRepository.save(utilisateur);
    }

    // Supprimer un utilisateur
    @Transactional
    public void supprimerUtilisateur(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateurRepository.delete(utilisateur);
    }

    // Promouvoir en administrateur
    @Transactional
    public Utilisateur promouvoirAdmin(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateur.setRole(RoleUtilisateur.ADMIN);
        utilisateur.setNiveauAcces(10);
        utilisateur.setTypeUtilisateur("admin");
        utilisateur.setDtype("admin");

        return utilisateurRepository.save(utilisateur);
    }

    // Rétrograder administrateur en conducteur
    @Transactional
    public Utilisateur retrograderAdmin(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateur.setRole(RoleUtilisateur.CONDUCTEUR);
        utilisateur.setNiveauAcces(1);
        utilisateur.setTypeUtilisateur("conducteur");
        utilisateur.setDtype("conducteur");

        return utilisateurRepository.save(utilisateur);
    }

    // Statistiques
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("total", utilisateurRepository.count());
        stats.put("actifs", utilisateurRepository.countByEstBloqueFalse());
        stats.put("bloques", utilisateurRepository.countByEstBloqueTrue());
        stats.put("admins", utilisateurRepository.countByRole(RoleUtilisateur.ADMIN));
        stats.put("conducteurs", utilisateurRepository.countByRole(RoleUtilisateur.CONDUCTEUR));

        return stats;
    }

    // Rechercher
    public List<Utilisateur> rechercher(String term) {
        if (term == null || term.trim().isEmpty()) {
            return getAllUtilisateurs();
        }

        return utilisateurRepository
                .findByNomContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        term.trim(),
                        term.trim()
                );
    }

    // Filtrer par rôle
    public List<Utilisateur> filtrerParRole(RoleUtilisateur role) {
        return utilisateurRepository.findByRole(role);
    }

    // Authentifier un utilisateur
    public Utilisateur authentifier(String email, String motDePasse) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElse(null);

        if (utilisateur == null) {
            System.out.println("❌ Utilisateur non trouvé : " + email);
            return null;
        }

        if (!passwordEncoder.matches(motDePasse, utilisateur.getMotDePasse())) {
            System.out.println("❌ Mot de passe incorrect : " + email);
            return null;
        }

        System.out.println("✅ Authentification réussie : " + email);
        return utilisateur;
    }
}