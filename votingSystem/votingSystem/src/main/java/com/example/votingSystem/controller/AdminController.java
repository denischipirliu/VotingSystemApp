package com.example.votingSystem.controller;

import com.example.votingSystem.dto.CandidateDTO;
import com.example.votingSystem.dto.ElectionDTO;
import com.example.votingSystem.model.*;
import com.example.votingSystem.repo.UserRepo;
import com.example.votingSystem.service.ElectionService;
import com.example.votingSystem.service.CandidateService;
import com.example.votingSystem.service.VoterService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ElectionService electionService;

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private VoterService voterService;

    @Autowired
    private UserRepo userRepo;


    // Create a new candidate
    @PostMapping("/candidates/create")
    public ResponseEntity<Candidate> createCandidate(@RequestBody CandidateDTO candidateDTO) {
        Candidate candidate = new Candidate();
        candidate.setName(candidateDTO.getName());
        candidate.setParty(candidateDTO.getParty());
        Candidate createdCandidate = candidateService.saveCandidate(candidate);
        return ResponseEntity.ok(createdCandidate);
    }

    // Get all candidates
    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        List<Candidate> candidates = candidateService.getAllCandidates();
        return ResponseEntity.ok(candidates);
    }

    //Update a candidate
    @PutMapping("/candidates/update/{id}")
    public ResponseEntity<Candidate> updateCandidate(@PathVariable Long id, @RequestBody CandidateDTO candidateDTO) {
        Candidate candidate = new Candidate();
        candidate.setId(id);
        candidate.setName(candidateDTO.getName());
        candidate.setParty(candidateDTO.getParty());
        Candidate updatedCandidate = candidateService.saveCandidate(candidate);
        return ResponseEntity.ok(updatedCandidate);
    }

    // Delete a candidate
    @DeleteMapping("/candidates/delete/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok().build();
    }

    // Create a new election
    @PostMapping("/elections/create")
    public ResponseEntity<Election> createElection(@RequestBody ElectionDTO electionDTO) {
        Election election = new Election();
        election.setName(electionDTO.getName());
        election.setActive(electionDTO.isActive());
        election.setStartDate(electionDTO.getStartDate());
        election.setEndDate(electionDTO.getEndDate());
        Election createdElection = electionService.createElection(election);
        return ResponseEntity.ok(createdElection);
    }

    // Get all elections
    @GetMapping("/elections")
    public ResponseEntity<List<Election>> getAllElections() {
        List<Election> elections = electionService.getAllElections();
        return new ResponseEntity<>(elections, org.springframework.http.HttpStatus.OK);
    }

    // Get election by ID
    @GetMapping("/elections/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable Long id) {
        return electionService.getElection(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get active elections
    @GetMapping("/elections/active")
    public ResponseEntity<List<Election>> getActiveElections() {
        List<Election> activeElections = electionService.getActiveElections();
        return ResponseEntity.ok(activeElections);
    }

    // Add candidates to an election
    @PostMapping("/elections/{electionId}/add-candidate/{candidateId}")
    public ResponseEntity<Void> addCandidatesToElection(@PathVariable Long electionId, @PathVariable Long candidateId) {
        electionService.addCandidateToElection(electionId, candidateId);
        return ResponseEntity.ok().build();
    }

    // Remove candidates from an election

    @DeleteMapping("/elections/{electionId}/remove-candidate/{candidateId}")
    public ResponseEntity<Void> removeCandidatesFromElection(@PathVariable Long electionId, @PathVariable Long candidateId) {
        electionService.removeCandidateFromElection(electionId, candidateId);
        return ResponseEntity.ok().build();
    }

    // Get candidates for an election
    @GetMapping("/elections/{electionId}/candidates")
    public ResponseEntity<List<Candidate>> getCandidatesForElection(@PathVariable Long electionId) {
        List<Candidate> candidates = electionService.getCandidatesForElection(electionId);
        return ResponseEntity.ok(candidates);
    }

    // Get the vote count for each candidate in a given election
    @GetMapping("/elections/{electionId}/vote-counts")
    public ResponseEntity<Map<String, Integer>> getVoteCountForElection(@PathVariable Long electionId) {
        Map<Candidate, Integer> voteCounts = electionService.getVoteCountForElection(electionId);
        Map<String, Integer> formattedVoteCounts = new HashMap<>();
        for (Map.Entry<Candidate, Integer> entry : voteCounts.entrySet()) {
            formattedVoteCounts.put(entry.getKey().getName() + " (" + entry.getKey().getParty() + ")", entry.getValue());
        }
        return ResponseEntity.ok(formattedVoteCounts);
    }

    // Get the election results (sorted by vote count)
    @GetMapping("/elections/{electionId}/results")
    public ResponseEntity<List<Candidate>> getElectionResults(@PathVariable Long electionId) {
        List<Candidate> sortedCandidates = electionService.getElectionResults(electionId);
        return ResponseEntity.ok(sortedCandidates);
    }

    // Start an election
    @PutMapping("/elections/{electionId}/start")
    public ResponseEntity<Void> startElection(@PathVariable Long electionId) {
        electionService.startElection(electionId);
        return ResponseEntity.ok().build();
    }

    // End an election
    @PutMapping("/elections/{electionId}/end")
    public ResponseEntity<Void> endElection(@PathVariable Long electionId) {
        electionService.endElection(electionId);
        return ResponseEntity.ok().build();
    }

    // Get all voters
    @GetMapping("/voters")
    public ResponseEntity<List<Voter>> getAllVoters() {
        List<Voter> voters = voterService.getAllVoters();
        return ResponseEntity.ok(voters);
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepo.findAll();
        return ResponseEntity.ok(users);
    }

    // Update a user
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = userRepo.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete a user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElseThrow();
        if (user.getRole() == Role.VOTER) {
            Voter voter = voterService.findVoterByUser(user);
            voterService.deleteVoter(voter.getId());
        }
        userRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
