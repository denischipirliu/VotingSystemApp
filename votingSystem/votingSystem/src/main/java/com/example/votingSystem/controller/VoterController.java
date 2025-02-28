package com.example.votingSystem.controller;

import com.example.votingSystem.dto.VoterRequestDTO;
import com.example.votingSystem.model.*;
import com.example.votingSystem.repo.UserRepo;
import com.example.votingSystem.service.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/voter")
public class VoterController {
    @Autowired
    private VoterService voterService;
    @Autowired
    private ElectionService electionService;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private VotingTokenService votingTokenService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private VoteService voteService;


    @GetMapping("/{id}")
    public ResponseEntity<Voter> getVoterById(@PathVariable Long id) {
        Voter voter = voterService.findVoterById(id);
        return new ResponseEntity<>(voter, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> saveVoterAndUser(@RequestBody VoterRequestDTO voterRequestDTO) {
        // Check if user already exists
        String email = voterRequestDTO.getEmail();
        User existingUser = userRepo.findByEmail(email);
        if (existingUser != null) {
            return new ResponseEntity<>("User already exists", HttpStatus.BAD_REQUEST);
        }

        // Create new user
        User user = new User();
        user.setEmail(voterRequestDTO.getEmail());
        user.setFullName(voterRequestDTO.getFullName());
        user.setMobile(voterRequestDTO.getMobile());
        user.setPassword(passwordEncoder.encode(voterRequestDTO.getPassword())); // Encrypt password
        user.setRole(Role.VOTER); // Set role to Voter

        User savedUser = userRepo.save(user);

        // Create Voter and associate with the newly created User
        Voter voter = new Voter();
        voter.setUser(savedUser);
        voter.setVoterIdCode(voterRequestDTO.getVoterIdCode());

        Voter savedVoter = voterService.saveVoter(voter);
        return new ResponseEntity<>(savedVoter, HttpStatus.CREATED);
    }

    @GetMapping("/voterIdCode/{id}")
    public ResponseEntity<String> getVoterIdCodeByUserId(@PathVariable Long id) {
        User user = userRepo.findById(id).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        Voter voter = voterService.findVoterByUser(user);
        if (voter == null) {
            return new ResponseEntity<>("Voter not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(voter.getVoterIdCode(), HttpStatus.OK);
    }

    @GetMapping("/active-elections")
    public ResponseEntity<List<Election>> getActiveElections() {
        List<Election> activeElections = electionService.getActiveElections();
        return ResponseEntity.ok(activeElections);
    }

    @GetMapping("/active-elections-not-voted")
    public ResponseEntity<List<Election>> getActiveElectionsNotVoted(Authentication authentication) {
        // Check if the user is authenticated
        if (authentication == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Get the User object
        String email = authentication.getName();
        User user = userRepo.findByEmail(email);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Ensure the user is a Voter
        if (user.getRole() != Role.VOTER) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Get the Voter object associated with the User
        Voter voter = voterService.findVoterByUser(user);
        if (voter == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Election> activeElections = electionService.getActiveElectionsNotVoted(voter);
        return ResponseEntity.ok(activeElections);
    }

    @PostMapping("/generate-token/{electionId}")
    public ResponseEntity<?> vote(@PathVariable Long electionId, Authentication authentication) {
        // Check if the user is authenticated
        if (authentication == null) {
            return new ResponseEntity<>("User not logged in", HttpStatus.UNAUTHORIZED);
        }

        // Get the User object
        String email = authentication.getName();
        User user = userRepo.findByEmail(email);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        // Ensure the user is a Voter
        if (user.getRole() != Role.VOTER) {
            return new ResponseEntity<>("User is not a voter", HttpStatus.FORBIDDEN);
        }

        // Get the Voter object associated with the User
        Voter voter = voterService.findVoterByUser(user);
        if (voter == null) {
            return new ResponseEntity<>("Voter not found", HttpStatus.NOT_FOUND);
        }

        // Check if the voter has already voted in this election
        if (voterService.hasVoterVotedInElection(voter, electionId)) {
            return new ResponseEntity<>("Voter has already voted in this election", HttpStatus.BAD_REQUEST);
        }

        Election election = electionService.findElectionById(electionId);

        Optional<VotingToken> existingToken = votingTokenService.findByVoterAndElection(voter, election);
        if (existingToken.isPresent()) {
            return new ResponseEntity<>("You have already voted or have a pending vote for this election", HttpStatus.BAD_REQUEST);
        }

        String token = UUID.randomUUID().toString();

        VotingToken votingToken = new VotingToken();
        votingToken.setVoter(voter);
        votingToken.setElection(election);
        votingToken.setToken(token);

        votingTokenService.saveVotingToken(votingToken);

        emailService.sendTokenEmail(voter.getUser().getEmail(), token);

        return new ResponseEntity<>("Token generated, please confirm your vote.", HttpStatus.OK);
    }

    @Transactional
    @PostMapping("/vote/{token}/{candidateId}")
    public ResponseEntity<?> vote(@PathVariable String token, @PathVariable Long candidateId) {
        VotingToken votingToken = votingTokenService.findVotingTokenByToken(token);
        if (votingToken == null) {
            return new ResponseEntity<>("Invalid token", HttpStatus.BAD_REQUEST);
        }

        if (voteService.hasTokenBeenUsed(token)) {
            return new ResponseEntity<>("Token has already been used", HttpStatus.BAD_REQUEST);
        }

        Election election = votingToken.getElection();

        Candidate candidate = candidateService.findCandidateById(candidateId);
        if (candidate == null) {
            return new ResponseEntity<>("Candidate not found", HttpStatus.NOT_FOUND);
        }

        Voter voter = votingToken.getVoter();

        votingTokenService.deleteVotingToken(token);

        Vote vote = new Vote();
        vote.setCandidate(candidate);
        vote.setElection(election);
        vote.setToken(token);

        electionService.recordVote(vote);

        voter.addElection(election);
        voterService.saveVoter(voter);

        return new ResponseEntity<>("Vote recorded", HttpStatus.OK);
    }

    @GetMapping("/active-elections/{electionId}")
    public ResponseEntity<?> hasVoterVotedInElection(@PathVariable Long electionId, Authentication authentication) {
        // Check if the user is authenticated
        if (authentication == null) {
            return new ResponseEntity<>("User not logged in", HttpStatus.UNAUTHORIZED);
        }

        // Get the User object
        String email = authentication.getName();
        User user = userRepo.findByEmail(email);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        // Ensure the user is a Voter
        if (user.getRole() != Role.VOTER) {
            return new ResponseEntity<>("User is not a voter", HttpStatus.FORBIDDEN);
        }

        // Get the Voter object associated with the User
        Voter voter = voterService.findVoterByUser(user);
        if (voter == null) {
            return new ResponseEntity<>("Voter not found", HttpStatus.NOT_FOUND);
        }

        boolean hasVoted = voterService.hasVoterVotedInElection(voter, electionId);
        return new ResponseEntity<>(hasVoted, HttpStatus.OK);
    }


}
