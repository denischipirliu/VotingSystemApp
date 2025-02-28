package com.example.votingSystem.service;

import com.example.votingSystem.model.Election;
import com.example.votingSystem.model.Voter;
import com.example.votingSystem.model.VotingToken;
import com.example.votingSystem.repo.VotingTokenRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VotingTokenService {
    @Autowired
    private VotingTokenRepo votingTokenRepo;

    public void saveVotingToken(VotingToken votingToken) {
        votingTokenRepo.save(votingToken);
    }

    public VotingToken findVotingTokenByToken(String token) {
        return votingTokenRepo.findByToken(token);
    }

    public void deleteVotingToken(String token) {
        votingTokenRepo.deleteByToken(token);
    }

    public Optional<VotingToken> findByVoterAndElection(Voter voter, Election election) {
        return votingTokenRepo.findByVoterAndElection(voter, election);
    }
}
