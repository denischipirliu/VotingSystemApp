package com.example.votingSystem.repo;

import com.example.votingSystem.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CandidateRepo extends JpaRepository<Candidate, Long> {
}
