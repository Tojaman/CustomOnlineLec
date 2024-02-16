package com.example.CustomLecture.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Iterator;

@RestController
@ResponseBody
public class MainController {




    @GetMapping("/")
    public String mainP() {

        //JWT에서 토큰으로생성된 일시적인 세션 username 획득
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        //role값 획득
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();


        return "Main Controller" + username + role;

    }


}