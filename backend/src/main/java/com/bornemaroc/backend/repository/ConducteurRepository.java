package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Conducteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConducteurRepository
        extends JpaRepository<Conducteur, Long> {

    List<Conducteur> findByEstBloque(boolean estBloque);
}