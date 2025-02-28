package com.example.votingSystem.repo;

import com.example.votingSystem.model.Demo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemoRepo extends JpaRepository<Demo, Long> {
}
