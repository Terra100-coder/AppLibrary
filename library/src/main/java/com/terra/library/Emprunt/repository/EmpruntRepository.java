package com.terra.library.Emprunt.repository;

import com.terra.library.Emprunt.entity.EmpruntEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmpruntRepository extends JpaRepository<EmpruntEntity, Long> {

    @Query("SELECT e.book.titre, COUNT(e) " +
            "FROM EmpruntEntity e " +
            "GROUP BY e.book.titre " +
            "ORDER BY COUNT(e) DESC")
    List<Object> findMostBorrowedBooks();

    @Query("SELECT e.user.nom, COUNT(e) " +
            "FROM EmpruntEntity e " +
            "GROUP BY e.user.nom " +
            "ORDER BY COUNT(e) DESC")
    List<Object[]> findMostActiveUsers();
}
