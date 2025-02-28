package com.example.votingSystem.repo;

import com.example.votingSystem.model.Election;
import com.example.votingSystem.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepo extends JpaRepository<Vote, Long> {
    List<Vote> findVotesByElection(Election election);

    boolean existsVoteByToken(String token);
}
