import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showSearch = false;
  searchQuery = '';

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.searchQuery = '';
    }
  }

  search() {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
      // TODO: Implementar lógica de búsqueda
    }
  }
}
