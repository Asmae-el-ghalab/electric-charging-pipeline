package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Prise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PriseRepository
        extends JpaRepository<Prise, Long> {

    List<Prise> findByBorneId(Long borneId);

}
