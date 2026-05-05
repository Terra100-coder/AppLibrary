import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Book, BookService, Emprunt, User } from '../../services/book.service';

interface SelectOption {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'app-emprunts',
  templateUrl: './emprunts.component.html',
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, TableModule, TagModule, ToastModule]
})
export class EmpruntsComponent implements OnInit {
  emprunts: Emprunt[] = [];
  books: Book[] = [];
  users: User[] = [];
  bookOptions: SelectOption[] = [];
  userOptions: SelectOption[] = [];
  loading = false;

  showForm = false;
  formData = {
    bookId: null as number | null,
    userId: null as number | null
  };

  constructor(
    private bookService: BookService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loadEmprunts();
    this.loadBooks();
    this.loadUsers();
  }

  loadEmprunts() {
    this.loading = true;
    this.bookService.getEmprunts().subscribe({
      next: data => {
        this.emprunts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Impossible de charger les emprunts.');
      }
    });
  }

  loadBooks() {
    this.bookService.getAll().subscribe({
      next: data => {
        this.books = data;
        this.bookOptions = data
          .filter(book => book.id != null)
          .map(book => ({
            label: `${book.titre} (stock: ${book.quantite})`,
            value: Number(book.id)
          }));
      },
      error: () => console.error('Impossible de charger les livres.')
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

  openAdd() {
    this.formData = { bookId: null, userId: null };
    this.showForm = true;
  }

  createEmprunt() {
    if (!this.formData.bookId || !this.formData.userId) {
      alert('Choisissez un livre et un utilisateur.');
      return;
    }

    this.bookService.emprunter(this.formData.bookId, this.formData.userId).subscribe(() => {
      this.showForm = false;
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Emprunt enregistré.' });
      this.loadAll();
    }, () => this.showError('Impossible de créer cet emprunt.'));
  }

  returnBook(empruntId: number) {
    this.bookService.returnBook(empruntId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Retour confirmé', detail: 'Le livre est de nouveau disponible.' });
      this.loadAll();
    }, () => this.showError('Impossible de retourner ce livre.'));
  }

  deleteEmprunt(empruntId: number) {
    if (!confirm('Voulez-vous vraiment supprimer cet emprunt ?')) {
      return;
    }

    this.bookService.deleteEmprunt(empruntId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Emprunt supprimé.' });
      this.loadAll();
    }, () => this.showError('Impossible de supprimer cet emprunt.'));
  }

  getBookTitle(bookId: number) {
    return this.books.find(b => b.id === bookId)?.titre || `Livre #${bookId}`;
  }

  getUserName(userId: number) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return `Utilisateur #${userId}`;
    }

    return `${user.nom} ${user.prenom}`;
  }

  closeForm() {
    this.showForm = false;
  }

  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
  }
}
