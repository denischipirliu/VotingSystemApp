package com.example.votingSystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String party;

    @ManyToMany(mappedBy = "candidates")
    @JsonBackReference
    private List<Election> elections;

    public Candidate() {
    }

    public Candidate(String name, String party) {
        this.name = name;
        this.party = party;
        this.elections = new ArrayList<>();
    }

    // Getters and setters for elections
    public List<Election> getElections() {
        return elections;
    }

    public void setElections(List<Election> elections) {
        this.elections = elections;
    }
}
