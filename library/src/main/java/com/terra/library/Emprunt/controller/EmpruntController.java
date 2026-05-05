package com.terra.library.Emprunt.controller;

import com.terra.library.Emprunt.dto.EmpruntDTO;
import com.terra.library.Emprunt.service.EmpruntService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("emprunts")
@CrossOrigin("*")
@AllArgsConstructor
public class EmpruntController {

    private EmpruntService empruntService;

    @GetMapping
    public List<EmpruntDTO> getAll() {
        return empruntService.getAll();
    }

    @GetMapping("/{id}")
    public EmpruntDTO getById(@PathVariable Long id) {
        return empruntService.getById(id);
    }

    @GetMapping("/stats/books")
    public List<Object> getStatsBooks() {
        return empruntService.getMostBorrowedBooks();
    }

    @GetMapping("/stats/users")
    public List<Object[]> getStatsUsers() {
        return empruntService.getMostActiveUsers();
    }

    @PostMapping
    public EmpruntDTO create(@RequestBody EmpruntDTO dto) {
        return empruntService.create(dto);
    }

    @PutMapping("/{id}/return")
    public EmpruntDTO returnBook(@PathVariable Long id) {
        return empruntService.returnBook(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        empruntService.delete(id);
    }
}
