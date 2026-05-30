package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Borne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BorneRepository
        extends JpaRepository<Borne, Long> {

    List<Borne> findByStatus(String status);
    List<Borne> findByCity(String city);
    List<Borne> findByOperator(String operator);
}