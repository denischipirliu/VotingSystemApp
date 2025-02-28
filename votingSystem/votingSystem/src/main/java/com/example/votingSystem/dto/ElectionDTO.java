package com.example.votingSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ElectionDTO {
    private String name;
    private boolean isActive;
    private String startDate;
    private String endDate;

}
