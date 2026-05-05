package com.terra.library.User.service;

import com.terra.library.User.dto.UserDTO;
import com.terra.library.User.entity.UserEntity;
import com.terra.library.User.mapper.UserMapper;
import com.terra.library.User.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper mapper;

    public List<UserDTO> getAllUser() {
      return mapper.toDTOS(userRepository.findAll());
    }

    public UserDTO getById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return mapper.toDTO(user);
    }

    public UserDTO createUser(UserDTO dto) {
        return mapper.toDTO(userRepository.save(mapper.toModel(dto)));
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setEmail(dto.getEmail());

        return mapper.toDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
