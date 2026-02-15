import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(private router: Router) {}

  onSubmit(event: Event, emailInput: HTMLInputElement) {
    event.preventDefault();
    const email = emailInput.value;
    if (email) {
      this.router.navigate(['/register'], { queryParams: { email } });
    }
  }
}
