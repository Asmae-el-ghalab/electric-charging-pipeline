package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.repository.BorneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BorneService {

    @Autowired
    private BorneRepository borneRepository;

    // Jiب kolchi bornes
    public List<Borne> getAllBornes() {
        return borneRepository.findAll();
    }

    // Jiب borne wahda b id
    public Borne getBorneById(Long id) {
        return borneRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Borne mkaynach: " + id)
                );
    }

    // Zid borne jdida
    public Borne addBorne(Borne borne) {
        return borneRepository.save(borne);
    }

    // Bdel statut
    public Borne updateStatus(Long id, String status) {
        Borne borne = getBorneById(id);
        borne.setStatus(status);
        return borneRepository.save(borne);
    }

    // 7yed borne
    public void deleteBorne(Long id) {
        borneRepository.deleteById(id);
    }

    // Filter b status
    public List<Borne> getByStatus(String status) {
        return borneRepository.findByStatus(status);
    }

    // Filter b city
    public List<Borne> getByCity(String city) {
        return borneRepository.findByCity(city);
    }

    // Filter b operator
    public List<Borne> getByOperator(String operator) {
        return borneRepository.findByOperator(operator);
    }
}
