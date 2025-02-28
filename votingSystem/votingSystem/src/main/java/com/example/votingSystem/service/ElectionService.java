package com.example.votingSystem.service;


import com.example.votingSystem.model.Candidate;
import com.example.votingSystem.model.Election;
import com.example.votingSystem.model.Vote;
import com.example.votingSystem.model.Voter;
import com.example.votingSystem.repo.CandidateRepo;
import com.example.votingSystem.repo.ElectionRepo;
import com.example.votingSystem.repo.VoteRepo;
import com.example.votingSystem.repo.VoterRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepo electionRepo;

    @Autowired
    private CandidateRepo candidateRepo;

    @Autowired
    private VoteRepo voteRepo;
    @Autowired
    private VoterRepo voterRepo;

    // Create a new election
    public Election createElection(Election election) {
        return electionRepo.save(election);
    }

    // Get an election by its ID
    public Optional<Election> getElection(Long electionId) {
        return electionRepo.findById(electionId);
    }

    // Get all elections
    public List<Election> getAllElections() {
        return electionRepo.findAll();
    }

    // Add candidates to an election
    public void addCandidateToElection(Long electionId, Long candidateId) {
        Optional<Election> electionOptional = electionRepo.findById(electionId);
        if (electionOptional.isPresent()) {
            Election election = electionOptional.get();
            election.addCandidate(candidateRepo.findById(candidateId).orElseThrow());
            electionRepo.save(election);
        }

    }

    // Record a vote
    public void recordVote(Vote vote) {
        voteRepo.save(vote);
    }

    // Get vote count for each candidate in a given election
    public Map<Candidate, Integer> getVoteCountForElection(Long electionId) {
        Optional<Election> electionOptional = electionRepo.findById(electionId);
        if (electionOptional.isPresent()) {
            Election election = electionOptional.get();
            Map<Candidate, Integer> voteCountMap = new HashMap<>();

            // Iterate through the votes and count the votes for each candidate
            List<Vote> votes = voteRepo.findVotesByElection(election);
            for (Vote vote : votes) {
                Candidate candidate = vote.getCandidate();
                voteCountMap.put(candidate, voteCountMap.getOrDefault(candidate, 0) + 1);
            }
            return voteCountMap;
        }
        return null;
    }

    // Get sorted results for candidates in a given election by vote count
    public List<Candidate> getElectionResults(Long electionId) {
        Map<Candidate, Integer> voteCountMap = getVoteCountForElection(electionId);
        if (voteCountMap != null) {
            return voteCountMap.entrySet().stream()
                    .sorted((entry1, entry2) -> entry2.getValue() - entry1.getValue())  // Sort by vote count in descending order
                    .map(Map.Entry::getKey)
                    .toList();
        }
        return null;
    }

    // Get active elections
    public List<Election> getActiveElections() {
        return electionRepo.findAllByIsActive(true);
    }

    public List<Candidate> getCandidatesForElection(Long electionId) {
        Optional<Election> electionOptional = electionRepo.findById(electionId);
        if (electionOptional.isPresent()) {
            Election election = electionOptional.get();
            return election.getCandidates();
        }
        return null;
    }

    public Election findElectionById(Long electionId) {
        return electionRepo.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));
    }

    public List<Election> getActiveElectionsNotVoted(Voter voter) {
        List<Election> activeElections = electionRepo.findAllByIsActive(true);
        Iterator<Election> iterator = activeElections.iterator();
        while (iterator.hasNext()) {
            Election election = iterator.next();
            if (voterRepo.hasVoterVotedInElection(voter, election.getId())) {
                iterator.remove();
            }
        }
        return activeElections;
    }

    public void removeCandidateFromElection(Long electionId, Long candidateId) {
        Optional<Election> electionOptional = electionRepo.findById(electionId);
        if (electionOptional.isPresent()) {
            Election election = electionOptional.get();
            election.removeCandidate(candidateRepo.findById(candidateId).orElseThrow());
            electionRepo.save(election);
        }
    }

    public void startElection(Long electionId) {
        Optional<Election> electionOptional = electionRepo.findById(electionId);
        if (electionOptional.isPresent()) {
            Election election = electionOptional.get();
            election.setActive(true);
            electionRepo.save(election);
        }
    }

    public void endElection(Long electionId) {
        Optional<Election> electionOptional = electionRepo.findById(electionId);
        if (electionOptional.isPresent()) {
            Election election = electionOptional.get();
            election.setActive(false);
            electionRepo.save(election);
        }
    }
}
