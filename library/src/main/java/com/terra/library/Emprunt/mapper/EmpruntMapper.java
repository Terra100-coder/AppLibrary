package com.terra.library.Emprunt.mapper;

import com.terra.library.Emprunt.dto.EmpruntDTO;
import com.terra.library.Emprunt.entity.EmpruntEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmpruntMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "userId", source = "user.id")
    EmpruntDTO toDTO(EmpruntEntity entity);
}
