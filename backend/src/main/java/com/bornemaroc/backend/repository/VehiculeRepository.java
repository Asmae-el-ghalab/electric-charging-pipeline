package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findByConducteurId(Long conducteurId);
}