package com.example.votingSystem.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class Demo implements Serializable {
    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private Long id;
    private String demoString;

    public Demo() {

    }

    public Demo(String demoString) {
        this.demoString = demoString;
    }

    public String getDemoString() {
        return demoString;
    }

    public void setDemoString(String demoString) {
        this.demoString = demoString;
    }
}
