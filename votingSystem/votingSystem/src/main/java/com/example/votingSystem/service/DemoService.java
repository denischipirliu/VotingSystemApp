package com.example.votingSystem.service;

import com.example.votingSystem.model.Demo;
import com.example.votingSystem.repo.DemoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class DemoService {
    private final DemoRepo demoRepo;

    @Autowired
    public DemoService(DemoRepo demoRepo) {
        this.demoRepo = demoRepo;
    }

    @Transactional(readOnly = true)
    public Demo findDemoById(Long demoId) {
        return demoRepo.findById(demoId).orElse(null);
    }
}
