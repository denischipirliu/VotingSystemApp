package com.example.votingSystem.repo;

import com.example.votingSystem.model.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectionRepo extends JpaRepository<Election, Long> {
    List<Election> findAllByIsActive(boolean isActive);
}
