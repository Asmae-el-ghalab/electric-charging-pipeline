package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.enums.RoleUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    long countByEstBloqueFalse();
    
    long countByEstBloqueTrue();
    
    long countByRole(RoleUtilisateur role);
    
    List<Utilisateur> findByNomContainingIgnoreCaseOrEmailContainingIgnoreCase(String nom, String email);
    
    List<Utilisateur> findByRole(RoleUtilisateur role);
}