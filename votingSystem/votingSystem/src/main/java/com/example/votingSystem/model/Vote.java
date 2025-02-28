package com.example.votingSystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Vote {
    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private Long id;

    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id")
    @JsonIgnore  // Prevent cyclic reference from the Vote to Election direction
    private Election election;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    public Vote() {

    }

    public Vote(String token,Candidate candidate, Election election) {
        this.token = token;
        this.candidate = candidate;
        this.election = election;
    }

}
