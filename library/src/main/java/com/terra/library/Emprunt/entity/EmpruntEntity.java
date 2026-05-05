package com.terra.library.Emprunt.entity;

import com.terra.library.Book.entity.BookEntity;
import com.terra.library.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class EmpruntEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dateEmprunt;
    private LocalDate dateRetour;
    @ManyToOne
    private BookEntity book;
    @ManyToOne
    private UserEntity user;
}
