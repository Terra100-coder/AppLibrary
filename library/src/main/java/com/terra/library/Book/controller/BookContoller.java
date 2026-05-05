package com.terra.library.Book.controller;

import com.terra.library.Book.dto.BookDTO;
import com.terra.library.Book.entity.BookEntity;
import com.terra.library.Book.service.BookService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("books")
@CrossOrigin("*")
public class BookContoller {

    private final BookService bookService;

    @GetMapping
    public List<BookDTO> getAll() {
        return bookService.getAllBook();
    }

    @GetMapping("/{id}")
    public BookDTO getOne(@PathVariable Long id) {
        return bookService.getById(id);
    }

    @GetMapping("/search/titre")
    public List<BookDTO> searchByTitre(@RequestParam String titre) {
        return bookService.searchByTitre(titre);
    }

    @GetMapping("/search/auteur")
    public List<BookDTO> searchByAuteur(@RequestParam String auteur) {
        return bookService.searchByAuteur(auteur);
    }

    @GetMapping("/search/category")
    public List<BookDTO> searchByCategory(@RequestParam String category) {
        return bookService.searchByCategory(category);
    }

    @PostMapping
    public BookDTO create(@RequestBody BookDTO dto) {
        return bookService.createBook(dto);
    }

    @PutMapping("/{id}")
    public BookDTO update(@PathVariable Long id, @RequestBody BookDTO dto) {
        return bookService.updateBook(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

}
