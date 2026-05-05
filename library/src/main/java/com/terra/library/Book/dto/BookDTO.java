package com.terra.library.Book.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookDTO {
    private Long id;
    private String titre;
    private String auteur;
    private String category;
    private Integer quantite;
    private Integer anneePublication;
}
