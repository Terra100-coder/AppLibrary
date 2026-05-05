package com.terra.library.Book.mapper;

import com.terra.library.Book.dto.BookDTO;
import com.terra.library.Book.entity.BookEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookMapper {

    BookDTO toDTO(BookEntity book);

    List<BookDTO> toDTOS(List<BookEntity> book);

    BookEntity toModel(BookDTO dto);
}
