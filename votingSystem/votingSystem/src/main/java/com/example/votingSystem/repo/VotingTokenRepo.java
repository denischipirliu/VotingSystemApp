package com.example.votingSystem.repo;

import com.example.votingSystem.model.Election;
import com.example.votingSystem.model.Voter;
import com.example.votingSystem.model.VotingToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VotingTokenRepo extends JpaRepository<VotingToken, Long> {

    VotingToken findByToken(String token);

    void deleteByToken(String token);

    Optional<VotingToken> findByVoterAndElection(Voter voter, Election election);
}
