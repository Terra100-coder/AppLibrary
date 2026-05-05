package com.terra.library.Book.repository;

import com.terra.library.Book.entity.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<BookEntity, Long> {

    List<BookEntity> findByTitreContainingIgnoreCase(String titre);

    List<BookEntity> findByAuteurContainingIgnoreCase(String auteur);

    List<BookEntity> findByCategoryContainingIgnoreCase(String category);

}
