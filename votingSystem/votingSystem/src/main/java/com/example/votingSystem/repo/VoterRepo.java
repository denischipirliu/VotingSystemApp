package com.example.votingSystem.repo;

import com.example.votingSystem.model.User;
import com.example.votingSystem.model.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoterRepo extends JpaRepository<Voter, Long> {
    Optional<Voter> findByUserId(Long userId);
    Voter findByUser(User user);
    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN TRUE ELSE FALSE END FROM Voter v JOIN v.elections e WHERE v = ?1 AND e.id = ?2")
    boolean hasVoterVotedInElection(Voter voter, Long electionId);
}
