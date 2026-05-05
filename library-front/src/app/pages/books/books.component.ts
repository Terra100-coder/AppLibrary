import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Book, BookService, User } from '../../services/book.service';

interface SelectOption {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'app-books',
  templateUrl: './books.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    DialogModule,
    TableModule,
    ToastModule
  ]
})
export class BooksComponent implements OnInit {

  books: Book[] = [];
  filteredBooks: Book[] = [];

  searchText: string = '';
  loading = false;

  showForm: boolean = false;
  isEditMode: boolean = false;

  users: User[] = [];
  userOptions: SelectOption[] = [];
  selectedUserId: number | null = null;
  showEmpruntDialog: boolean = false;
  selectedBookForEmprunt: Book | null = null;

  selectedBook: Book = {
    id: null,
    titre: '',
    auteur: '',
    category: '',
    quantite: 0,
    anneePublication: 2024
  };

  constructor(
    private bookService: BookService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadUsers();
  }

  loadBooks() {
    this.loading = true;
    this.bookService.getAll().subscribe({
      next: data => {
        this.books = data;
        this.searchBooks();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Impossible de charger les livres.');
      }
    });
  }

  loadUsers() {
    this.bookService.getUsers().subscribe({
      next: data => {
        this.users = data;
        this.userOptions = data
          .filter(user => user.id != null)
          .map(user => ({
            label: `${user.nom} ${user.prenom}`,
            value: Number(user.id)
          }));
      },
      error: () => console.error('Impossible de charger les utilisateurs.')
    });
  }

  openEmprunt(book: Book) {
    this.selectedBookForEmprunt = book;
    this.showEmpruntDialog = true;
  }

  confirmEmprunt() {

    if (!this.selectedUserId || !this.selectedBookForEmprunt?.id) {
      this.showError('Choisissez un utilisateur.');
      return;
    }

    this.bookService.emprunter(
      Number(this.selectedBookForEmprunt.id),
      this.selectedUserId
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Livre emprunté.' });
        this.showEmpruntDialog = false;
        this.selectedUserId = null;
        this.loadBooks();
      },
      error: () => this.showError('Impossible d\'emprunter ce livre.')
    });
  }

  searchBooks() {
    const search = this.searchText.toLowerCase();
    this.filteredBooks = this.books.filter(b =>
      b.titre?.toLowerCase().includes(search) ||
      b.auteur?.toLowerCase().includes(search) ||
      b.category?.toLowerCase().includes(search)
    );
  }

  openAdd() {
    this.isEditMode = false;
    this.showForm = true;

    this.selectedBook = {
      titre: '',
      auteur: '',
      category: '',
      quantite: 0,
      anneePublication: 2024
    };
  }

  editBook(book: Book) {
    this.isEditMode = true;
    this.showForm = true;
    this.selectedBook = { ...book };
  }

  saveBook() {
    if (!this.selectedBook.titre || !this.selectedBook.auteur || !this.selectedBook.category) {
      this.showError('Titre, auteur et catégorie sont obligatoires.');
      return;
    }

    if (this.isEditMode) {
      this.bookService.updateBook(Number(this.selectedBook.id), this.selectedBook)
        .subscribe({
          next: () => this.afterAction('Livre modifié avec succès.'),
          error: () => this.showError('Impossible de modifier ce livre.')
        });
    } else {
      this.bookService.addBook(this.selectedBook)
        .subscribe({
          next: () => this.afterAction('Livre enregistré avec succès.'),
          error: () => this.showError('Impossible d\'enregistrer ce livre.')
        });
    }

  }

  afterAction(message: string) {
    this.showForm = false;
    this.isEditMode = false;
    this.messageService.add({ severity: 'success', summary: 'Succès', detail: message });
    this.loadBooks();
  }

  deleteBook(id: number | null | undefined) {
    if (id == null) return;
    if (!confirm('Voulez-vous vraiment supprimer ce livre ?')) return;

    this.bookService.deleteBook(id)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Livre supprimé.' });
          this.loadBooks();
        },
        error: () => this.showError('Impossible de supprimer ce livre.')
      });
  }

  closeForm() {
    this.showForm = false;
    this.isEditMode = false;
  }

  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
  }
}
