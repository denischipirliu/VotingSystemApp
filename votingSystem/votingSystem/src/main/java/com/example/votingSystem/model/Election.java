package com.example.votingSystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.*;

@Entity
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String startDate;

    private String endDate;

    private boolean isActive;

    @ManyToMany
    @JoinTable(
            name = "candidate_election",
            joinColumns = @JoinColumn(name = "election_id"),
            inverseJoinColumns = @JoinColumn(name = "candidate_id")
    )
    @JsonManagedReference  // Prevent circular reference in the Election to Candidate direction
    private List<Candidate> candidates;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id")
    @JsonBackReference  // Prevent cyclic reference from the Election to Vote direction
    private List<Vote> votes;

    @ManyToMany(mappedBy = "elections")
    @JsonBackReference  // Prevent circular reference in the Election to Voter direction
    private Set<Voter> voters = new HashSet<>();




    // Map to store vote count for each candidate
    @Transient
    private Map<Candidate, Integer> candidateVotes;

    public Election() {
        this.candidates = new ArrayList<>();
        this.votes = new ArrayList<>();
        this.candidateVotes = new HashMap<>();
    }

    public Election(String name, String startDate, String endDate, boolean isActive) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.candidates = new ArrayList<>();
        this.votes = new ArrayList<>();
        this.candidateVotes = new HashMap<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public List<Candidate> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<Candidate> candidates) {
        this.candidates = candidates;
        updateCandidateVotes();
    }

    public List<Vote> getVotes() {
        return votes;
    }

    public void setVotes(List<Vote> votes) {
        this.votes = votes;
        updateCandidateVotes();
    }

    // Method to count votes and update candidateVotes map
    private void updateCandidateVotes() {
        candidateVotes.clear();
        for (Candidate candidate : candidates) {
            candidateVotes.put(candidate, 0);  // Initialize vote count for each candidate
        }

        for (Vote vote : votes) {
            Candidate votedCandidate = vote.getCandidate();
            if (candidateVotes.containsKey(votedCandidate)) {
                candidateVotes.put(votedCandidate, candidateVotes.get(votedCandidate) + 1);
            }
        }
    }

    // Getter for candidate vote count
    public Map<Candidate, Integer> getCandidateVotes() {
        return candidateVotes;
    }

    public void addCandidate(Candidate candidate) {
        this.candidates.add(candidate);
        candidateVotes.put(candidate, 0);  // Initialize vote count when a candidate is added
    }

    public void removeCandidate(Candidate candidate) {
        this.candidates.remove(candidate);
        candidateVotes.remove(candidate);  // Remove vote count when a candidate is removed
    }
}
