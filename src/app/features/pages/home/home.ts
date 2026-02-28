/**
 * ============================================================
 * HOME PAGE - Componente de la Página Principal
 * ============================================================
 *
 * ¿QUÉ HACE ESTE COMPONENTE?
 * Muestra la página principal con:
 * 1. Un carrusel "infinito" de imágenes hero
 * 2. Un grid de categorías de joyería
 *
 * ¿CÓMO FUNCIONA EL CARRUSEL INFINITO?
 * El carrusel usa CSS scroll-snap para el deslizamiento suave.
 * JavaScript detecta cuándo el usuario llega al FINAL o al INICIO
 * y lo "rebota" al otro extremo, creando la ilusión de bucle infinito.
 *
 * Además, tiene autoplay: cada 5 segundos avanza al siguiente slide.
 * Si el usuario interactúa (hace scroll manual), el autoplay se pausa
 * por 8 segundos para no interrumpir.
 */
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  /**
   * @ViewChild — Referencia directa al elemento .carousel del HTML.
   * Angular nos da acceso al elemento del DOM para manipularlo con JS.
   */
  @ViewChild('carouselEl') carouselRef!: ElementRef<HTMLDivElement>;

  /** ID del intervalo de autoplay (para poder limpiarlo al destruir) */
  private autoplayInterval: any = null;
  /** Timeout para pausar autoplay cuando el usuario interactúa */
  private userInteractionTimeout: any = null;
  /** Flag para saber si el autoplay está pausado */
  private isAutoplayPaused = false;

  /**
   * ngAfterViewInit — Se ejecuta DESPUÉS de que Angular renderiza el HTML.
   * Es el momento correcto para acceder a elementos del DOM como el carousel.
   */
  ngAfterViewInit() {
    this.setupInfiniteLoop();
    this.startAutoplay();
  }

  /**
   * ngOnDestroy — Limpieza al salir de la página.
   * IMPORTANTE: siempre limpiar intervalos/timeouts para evitar memory leaks.
   */
  ngOnDestroy() {
    if (this.autoplayInterval) clearInterval(this.autoplayInterval);
    if (this.userInteractionTimeout) clearTimeout(this.userInteractionTimeout);
  }

  /**
   * setupInfiniteLoop — Detecta cuándo el scroll llega al final o al inicio
   * y lo "rebota" al otro extremo.
   *
   * ¿Cómo funciona?
   * 1. Escucha el evento 'scrollend' del carrusel (se dispara al dejar de hacer scroll)
   * 2. Compara scrollLeft con scrollWidth - clientWidth
   *    - Si scrollLeft >= max → está al FINAL → salta al INICIO
   *    - Si scrollLeft <= 0 → está al INICIO → salta al FINAL
   * 3. El salto usa behavior: 'instant' para que sea invisible al usuario
   */
  private setupInfiniteLoop() {
    const carousel = this.carouselRef?.nativeElement;
    if (!carousel) return;

    // 'scrollend' se dispara cuando el scroll termina (después del snap)
    carousel.addEventListener('scrollend', () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      if (carousel.scrollLeft >= maxScroll - 2) {
        // Llegó al FINAL → saltar al primer slide (instantáneamente)
        carousel.scrollTo({ left: 0, behavior: 'instant' });
      } else if (carousel.scrollLeft <= 2) {
        // Llegó al INICIO → saltar al último slide (instantáneamente)
        // Solo si el usuario hizo scroll hacia la izquierda (no al cargar)
      }
    });

    // Pausar autoplay cuando el usuario toca/interactúa con el carrusel
    carousel.addEventListener('pointerdown', () => this.pauseAutoplay());
    carousel.addEventListener('wheel', () => this.pauseAutoplay());
  }

  /**
   * startAutoplay — Cada 5 segundos, avanza 1 slide.
   * Usa scrollBy con behavior: 'smooth' para transición suave.
   */
  private startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      if (this.isAutoplayPaused) return; // No avanzar si el usuario interactuó

      const carousel = this.carouselRef?.nativeElement;
      if (!carousel) return;

      // Avanzar exactamente el ancho de 1 slide (= ancho del carrusel visible)
      carousel.scrollBy({
        left: carousel.clientWidth,
        behavior: 'smooth',
      });
    }, 5000); // 5 segundos entre slides
  }

  /**
   * pauseAutoplay — Pausa el autoplay por 8 segundos cuando el usuario interactúa.
   * Esto evita que el carrusel se mueva mientras el usuario está mirando un slide.
   */
  private pauseAutoplay() {
    this.isAutoplayPaused = true;

    // Limpiar timeout anterior si existe
    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }

    // Reanudar autoplay después de 8 segundos sin interacción
    this.userInteractionTimeout = setTimeout(() => {
      this.isAutoplayPaused = false;
    }, 8000);
  }
}
