import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpAuth } from '../../../core/services/http-auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnDestroy {
  user: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private httpAuth: HttpAuth,
  ) {
    this.httpAuth.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(event: Event, emailInput: HTMLInputElement) {
    event.preventDefault();
    const email = emailInput.value;
    if (email) {
      emailInput.value = '';
      this.router.navigate(['/register'], { queryParams: { email } }).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }
}
