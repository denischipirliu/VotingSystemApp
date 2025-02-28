package com.example.votingSystem.service;

import com.example.votingSystem.repo.VoteRepo;
import org.springframework.stereotype.Service;


@Service
public class VoteService {
    private final VoteRepo voteRepo;

    public VoteService(VoteRepo voteRepo) {
        this.voteRepo = voteRepo;
    }

    public boolean hasTokenBeenUsed(String token) {
        return voteRepo.existsVoteByToken(token);
    }
}
