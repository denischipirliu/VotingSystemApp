package com.example.votingSystem.controller;

import com.example.votingSystem.model.Demo;
import com.example.votingSystem.service.DemoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class DemoController {
    private final DemoService demoService;

    public DemoController(DemoService demoService) {
        this.demoService = demoService;
    }

    @GetMapping("/demo")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Demo> getDemoById() {
        Demo demo = demoService.findDemoById(1L);
        return new ResponseEntity<>(demo, HttpStatus.OK);
    }

}
