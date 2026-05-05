package com.terra.library.User.mapper;

import com.terra.library.User.dto.UserDTO;
import com.terra.library.User.entity.UserEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDTO(UserEntity user);

    List<UserDTO> toDTOS(List<UserEntity> users);

    UserEntity toModel(UserDTO dto);
}
