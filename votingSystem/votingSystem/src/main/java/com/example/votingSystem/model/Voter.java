package com.example.votingSystem.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Voter {
    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private Long id;

    @OneToOne
    private User user;

    private String voterIdCode;

    @ManyToMany
    @JoinTable(
            name = "voter_election",
            joinColumns = @JoinColumn(name = "voter_id"),
            inverseJoinColumns = @JoinColumn(name = "election_id")
    )
    @JsonManagedReference  // Prevent circular reference in the Voter to Election direction
    private Set<Election> elections = new HashSet<>();

    public Voter() {

    }

    public Voter(User user, String voterIdCode) {
        this.user = user;
        this.voterIdCode = voterIdCode;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVoterIdCode() {
        return voterIdCode;
    }

    public void setVoterIdCode(String voterIdCode) {
        this.voterIdCode = voterIdCode;
    }

    public Set<Election> getElections() {
        return elections;
    }

    public void setElections(Set<Election> elections) {
        this.elections = elections;
    }

    public void addElection(Election election) {
        this.elections.add(election);
    }
}
