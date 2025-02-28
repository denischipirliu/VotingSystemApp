package com.example.votingSystem.service;

import com.example.votingSystem.model.User;

import java.util.List;


public interface UserService {


    List<User> getAllUser()  ;

    User findUserProfileByJwt(String jwt);

    User findUserByEmail(String email) ;

    User findUserById(String userId) ;

    List<User> findAllUsers();

    void deleteUser(String userId) ;


}