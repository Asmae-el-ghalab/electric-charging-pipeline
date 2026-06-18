package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Conducteur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConducteurRepository extends JpaRepository<Conducteur, Long> {

    List<Conducteur> findByEstBloque(Boolean estBloque);

}