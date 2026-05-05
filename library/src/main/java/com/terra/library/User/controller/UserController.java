package com.terra.library.User.controller;

import com.terra.library.User.dto.UserDTO;
import com.terra.library.User.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
@CrossOrigin("*")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserDTO> getAll() {
        return userService.getAllUser();
    }

    @GetMapping("/{id}")
    public UserDTO getOne(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PostMapping
    public UserDTO create(@RequestBody UserDTO dto) {
        return userService.createUser(dto);
    }

    @PutMapping("/{id}")
    public UserDTO update(@PathVariable Long id, @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
