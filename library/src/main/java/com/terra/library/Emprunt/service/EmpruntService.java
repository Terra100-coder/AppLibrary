package com.terra.library.Emprunt.service;

import com.terra.library.Book.entity.BookEntity;
import com.terra.library.Book.repository.BookRepository;
import com.terra.library.Emprunt.dto.EmpruntDTO;
import com.terra.library.Emprunt.entity.EmpruntEntity;
import com.terra.library.Emprunt.mapper.EmpruntMapper;
import com.terra.library.Emprunt.repository.EmpruntRepository;
import com.terra.library.User.entity.UserEntity;
import com.terra.library.User.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class EmpruntService {

    private EmpruntRepository empruntRepository;
    private BookRepository bookRepository;
    private UserRepository userRepository;
    private EmpruntMapper mapper;

    public List<EmpruntDTO> getAll() {
        return empruntRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public EmpruntDTO getById(Long id) {
        EmpruntEntity emprunt = empruntRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprunt introuvable"));

        return mapper.toDTO(emprunt);
    }

    public EmpruntDTO create(EmpruntDTO dto) {

        //  récupérer user et book
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        BookEntity book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Livre introuvable"));

        // 2. vérifier stock
        if (book.getQuantite() <= 0) {
            throw new RuntimeException("Livre indisponible");
        }

        // 3. décrémenter stock
        book.setQuantite(book.getQuantite() - 1);
        bookRepository.save(book);

        // 4. créer emprunt
        EmpruntEntity emprunt = new EmpruntEntity();
        emprunt.setUser(user);
        emprunt.setBook(book);
        emprunt.setDateEmprunt(LocalDate.now());
        emprunt.setDateRetour(null);

        return mapper.toDTO(empruntRepository.save(emprunt));
    }

    // RETOUR LIVRE
    public EmpruntDTO returnBook(Long id) {

        EmpruntEntity emprunt = empruntRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprunt introuvable"));

        if (emprunt.getDateRetour() != null) {
            throw new RuntimeException("Livre déjà retourné");
        }

        // marquer retour
        emprunt.setDateRetour(LocalDate.now());

        // remettre stock
        BookEntity book = emprunt.getBook();
        book.setQuantite(book.getQuantite() + 1);
        bookRepository.save(book);

        return mapper.toDTO(empruntRepository.save(emprunt));
    }

    // DELETE
    public void delete(Long id) {
        empruntRepository.deleteById(id);
    }

    public List<Object> getMostBorrowedBooks() {
        return empruntRepository.findMostBorrowedBooks();
    }

    public List<Object[]> getMostActiveUsers() {
        return empruntRepository.findMostActiveUsers();
    }
}
