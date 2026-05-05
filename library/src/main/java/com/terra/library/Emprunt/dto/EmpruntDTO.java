package com.terra.library.Emprunt.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmpruntDTO {

    private Long id;
    private LocalDate dateEmprunt;
    private LocalDate dateRetour;
    private Long bookId;
    private Long userId;
}
