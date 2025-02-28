package com.example.votingSystem.service;

import com.example.votingSystem.model.Candidate;
import com.example.votingSystem.repo.CandidateRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {
    private final CandidateRepo candidateRepo;

    public CandidateService(CandidateRepo candidateRepo) {
        this.candidateRepo = candidateRepo;
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepo.findAll();
    }

    public Candidate findCandidateById(Long id) {
        return candidateRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
    }

    public Candidate saveCandidate(Candidate candidate) {
        return candidateRepo.save(candidate);
    }

    public void deleteCandidate(Long id) {
        candidateRepo.deleteById(id);
    }
}
