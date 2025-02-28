package com.example.votingSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendTokenEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Voting Token");
        message.setText("Hello, \n\n" +
                "Here is your voting token: " + token + "\n\n" +
                "Please use this token to cast your vote.\n\n" +
                "Thank you.");

        emailSender.send(message);
    }
}

