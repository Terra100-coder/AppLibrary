import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Book {
  id?: number | null;
  titre: string;
  auteur: string;
  category: string;
  quantite: number;
  anneePublication: number;
}

export interface User {
  id?: number | null;
  nom: string;
  prenom: string;
  email: string;
}

export interface Emprunt {
  id: number;
  dateEmprunt: string;
  dateRetour: string | null;
  bookId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly api = '/api/books';
  private readonly usersApi = '/api/users';
  private readonly empruntApi = '/api/emprunts';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Book[]>(this.api);
  }

  addBook(book: Book) {
    return this.http.post(this.api, book);
  }

  updateBook(id: number, book: Book) {
    return this.http.put(`${this.api}/${id}`, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  getUsers() {
    return this.http.get<User[]>(this.usersApi);
  }

  addUser(user: User) {
    return this.http.post(this.usersApi, user);
  }

  updateUser(id: number, user: User) {
    return this.http.put(`${this.usersApi}/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.usersApi}/${id}`);
  }

  getEmprunts() {
    return this.http.get<Emprunt[]>(this.empruntApi);
  }

  emprunter(bookId: number, userId: number) {
    return this.http.post(this.empruntApi, { bookId, userId });
  }

  returnBook(empruntId: number) {
    return this.http.put(`${this.empruntApi}/${empruntId}/return`, {});
  }

  deleteEmprunt(empruntId: number) {
    return this.http.delete(`${this.empruntApi}/${empruntId}`);
  }

  getStatsBooks() {
    return this.http.get<any[]>(`${this.empruntApi}/stats/books`);
  }

  getStatsUsers() {
    return this.http.get<any[]>(`${this.empruntApi}/stats/users`);
  }
}
