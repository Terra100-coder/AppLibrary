package com.terra.library.Book.service;

import com.terra.library.Book.dto.BookDTO;
import com.terra.library.Book.entity.BookEntity;
import com.terra.library.Book.mapper.BookMapper;
import com.terra.library.Book.repository.BookRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final BookMapper mapper;

    public List<BookDTO> getAllBook() {
        return  mapper.toDTOS(bookRepository.findAll());
    }

    public BookDTO getById(Long id) {
        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ce livre n'est pas disponible"));
        return mapper.toDTO(book);
    }

    public BookDTO createBook(BookDTO dto) {
        BookEntity book = mapper.toModel(dto);
        return mapper.toDTO(bookRepository.save(book));
    }

    public BookDTO updateBook(Long id, BookDTO dto) {

        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livre introuvable"));

        book.setAuteur(dto.getAuteur());
        book.setTitre(dto.getTitre());
        book.setCategory(dto.getCategory());
        book.setQuantite(dto.getQuantite());
        book.setAnneePublication(dto.getAnneePublication());

        return mapper.toDTO(bookRepository.save(book));
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public List<BookDTO> searchByTitre(String titre) {
        return mapper.toDTOS(bookRepository.findByTitreContainingIgnoreCase(titre));
    }

    public List<BookDTO> searchByAuteur(String auteur) {
        return mapper.toDTOS(bookRepository.findByAuteurContainingIgnoreCase(auteur));
    }

    public List<BookDTO> searchByCategory(String category) {
        return mapper.toDTOS(bookRepository.findByCategoryContainingIgnoreCase(category));
    }
}
