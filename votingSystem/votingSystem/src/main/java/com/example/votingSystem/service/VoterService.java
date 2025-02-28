package com.example.votingSystem.service;

import com.example.votingSystem.model.User;
import com.example.votingSystem.model.Vote;
import com.example.votingSystem.model.Voter;
import com.example.votingSystem.repo.VoteRepo;
import com.example.votingSystem.repo.VoterRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoterService {
    private final VoterRepo voterRepo;
    private final VoteRepo voteRepo;

    public VoterService(VoterRepo voterRepo, VoteRepo voteRepo) {
        this.voterRepo = voterRepo;
        this.voteRepo = voteRepo;
    }

    public Voter findVoterById(Long id) {
        return voterRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Voter not found"));

    }

    public Voter saveVoter(Voter voter) {
        return voterRepo.save(voter);
    }

    public Voter findVoterByUser(User user) {
        return voterRepo.findByUser(user);
    }

    public boolean hasVoterVotedInElection(Voter voter, Long electionId) {
        return voterRepo.hasVoterVotedInElection(voter, electionId);
    }

    public Vote recordVote(Vote vote) {
        return voteRepo.save(vote);
    }


    public List<Voter> getAllVoters() {
        return voterRepo.findAll();
    }

    public void deleteVoter(Long id) {
        voterRepo.deleteById(id);
    }
}
