package com.example.votingSystem.dto;

import com.example.votingSystem.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VoterRequestDTO {

    private String email;
    private String password;
    private String fullName;
    private String mobile;
    private Role role;
    private String voterIdCode;

}
