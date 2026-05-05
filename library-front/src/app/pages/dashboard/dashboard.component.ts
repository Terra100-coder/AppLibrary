import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Book, BookService, Emprunt, User } from '../../services/book.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [CommonModule, TableModule, TagModule]
})
export class DashboardComponent implements OnInit {
  totalBooks = 0;
  totalStock = 0;
  totalUsers = 0;
  totalEmprunts = 0;
  empruntsActifs = 0;
  loading = false;

  booksStats: { label: string; value: number }[] = [];
  usersStats: { label: string; value: number }[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  get activeRate() {
    if (!this.totalEmprunts) return 0;
    return Math.round((this.empruntsActifs / this.totalEmprunts) * 100);
  }

  loadDashboard() {
    this.loading = true;
    forkJoin({
      books: this.bookService.getAll().pipe(catchError(() => of([] as Book[]))),
      users: this.bookService.getUsers().pipe(catchError(() => of([] as User[]))),
      emprunts: this.bookService.getEmprunts().pipe(catchError(() => of([] as Emprunt[]))),
      bookStats: this.bookService.getStatsBooks().pipe(catchError(() => of([]))),
      userStats: this.bookService.getStatsUsers().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ books, users, emprunts, bookStats, userStats }) => {
        this.totalBooks = books.length;
        this.totalStock = books.reduce((sum, book) => sum + Number(book.quantite || 0), 0);
        this.totalUsers = users.length;
        this.totalEmprunts = emprunts.length;
        this.empruntsActifs = emprunts.filter(emprunt => !emprunt.dateRetour).length;
        this.booksStats = this.normalizeStats(bookStats, this.buildBookStats(emprunts, books));
        this.usersStats = this.normalizeStats(userStats, this.buildUserStats(emprunts, users));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private normalizeStats(data: unknown, fallback: { label: string; value: number }[]) {
    if (!Array.isArray(data) || data.length === 0) return fallback;

    return data.slice(0, 5).map((entry: unknown) => {
      if (Array.isArray(entry)) {
        return { label: String(entry[0]), value: Number(entry[1] || 0) };
      }

      const record = entry as Record<string, unknown>;
      return {
        label: String(record['label'] || record['titre'] || record['nom'] || 'Inconnu'),
        value: Number(record['value'] || record['count'] || record['total'] || 0)
      };
    });
  }

  private buildBookStats(emprunts: Emprunt[], books: Book[]) {
    const counts = new Map<number, number>();
    emprunts.forEach(emprunt => counts.set(emprunt.bookId, (counts.get(emprunt.bookId) || 0) + 1));

    return Array.from(counts.entries())
      .map(([bookId, value]) => ({
        label: books.find(book => book.id === bookId)?.titre || `Livre #${bookId}`,
        value
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }

  private buildUserStats(emprunts: Emprunt[], users: User[]) {
    const counts = new Map<number, number>();
    emprunts.forEach(emprunt => counts.set(emprunt.userId, (counts.get(emprunt.userId) || 0) + 1));

    return Array.from(counts.entries())
      .map(([userId, value]) => {
        const user = users.find(entry => entry.id === userId);
        return {
          label: user ? `${user.nom} ${user.prenom}` : `Utilisateur #${userId}`,
          value
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }
}
