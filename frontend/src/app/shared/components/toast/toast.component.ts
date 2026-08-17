import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div
          [@slideIn]
          class="toast"
          [class]="'toast-' + toast.type"
          (click)="removeToast(toast.id)"
        >
          <div class="toast-content">
            <span class="toast-icon">
              @switch (toast.type) {
                @case ('success') {
                  ✓
                }
                @case ('error') {
                  ✕
                }
                @case ('warning') {
                  ⚠
                }
                @case ('info') {
                  ℹ
                }
              }
            </span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <div class="toast-progress" [style.animation-duration]="(toast.duration || 4000) + 'ms'"></div>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    }

    .toast {
      display: flex;
      flex-direction: column;
      min-width: 300px;
      max-width: 500px;
      margin-bottom: 10px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toast-icon {
      font-weight: bold;
      font-size: 18px;
      flex-shrink: 0;
    }

    .toast-message {
      word-break: break-word;
      flex: 1;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background-color: currentColor;
      opacity: 0.5;
      animation: progress linear forwards;
    }

    @keyframes progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    /* Toast Types */
    .toast-success {
      background-color: #d4edda;
      color: #155724;
      border-left: 4px solid #28a745;
    }

    .toast-error {
      background-color: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }

    .toast-warning {
      background-color: #fff3cd;
      color: #856404;
      border-left: 4px solid #ffc107;
    }

    .toast-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }

    @media (max-width: 768px) {
      .toast-container {
        left: 10px;
        right: 10px;
      }

      .toast {
        min-width: unset;
        max-width: unset;
      }
    }
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(400px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(400px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];

  ngOnInit(): void {
    this.toastService.toasts.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }
}
