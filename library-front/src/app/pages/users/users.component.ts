import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BookService, User } from '../../services/book.service';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, DialogModule, TableModule, ToastModule]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchText = '';
  loading = false;

  showForm = false;
  isEditMode = false;

  selectedUser: User = {
    id: null,
    nom: '',
    prenom: '',
    email: ''
  };

  constructor(
    private bookService: BookService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.bookService.getUsers().subscribe({
      next: data => {
        this.users = data;
        this.searchUsers();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Impossible de charger les utilisateurs.');
      }
    });
  }

  searchUsers() {
    const search = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nom?.toLowerCase().includes(search) ||
      user.prenom?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  }

  openAdd() {
    this.isEditMode = false;
    this.showForm = true;
    this.selectedUser = { id: null, nom: '', prenom: '', email: '' };
  }

  editUser(user: any) {
    this.isEditMode = true;
    this.showForm = true;
    this.selectedUser = { ...user };
  }

  saveUser() {
    if (!this.selectedUser.nom || !this.selectedUser.prenom || !this.selectedUser.email) {
      this.showError('Nom, prénom et email sont obligatoires.');
      return;
    }

    if (this.isEditMode) {
      this.bookService.updateUser(Number(this.selectedUser.id), this.selectedUser)
        .subscribe({
          next: () => this.afterAction('Utilisateur modifié avec succès.'),
          error: () => this.showError('Impossible de modifier cet utilisateur.')
        });
      return;
    }

    this.bookService.addUser(this.selectedUser)
      .subscribe({
        next: () => this.afterAction('Utilisateur enregistré avec succès.'),
        error: () => this.showError('Impossible d\'enregistrer cet utilisateur.')
      });
  }

  deleteUser(id: number | null | undefined) {
    if (id == null) return;
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      return;
    }

    this.bookService.deleteUser(id)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Utilisateur supprimé.' });
          this.loadUsers();
        },
        error: () => this.showError('Impossible de supprimer cet utilisateur.')
      });
  }

  afterAction(message: string) {
    this.showForm = false;
    this.isEditMode = false;
    this.messageService.add({ severity: 'success', summary: 'Succès', detail: message });
    this.loadUsers();
  }

  closeForm() {
    this.showForm = false;
    this.isEditMode = false;
  }

  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
  }
}
