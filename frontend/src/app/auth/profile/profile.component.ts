import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);

  userId: number | null = null;
  isEditing = false;

  profile = {
    name: '',
    rank: '',
    bio: 'Silent, precise, and always one step ahead.',
    avatar: '/assets/Newchar/Front - Walking/Front - Walking_000.png'
  };

  editForm = {
    name: '',
    avatar: '/assets/Newchar/Front - Walking/Front - Walking_000.png',
    bio: 'Silent, precise, and always one step ahead.'
  };

  stats = [
    { label: 'GAMES PLAYED', value: '0' },
    { label: 'GAMES WON', value: '0' },
    { label: 'BEST TIME', value: '00:00:00' },
    { label: 'BEST SCORE', value: '0' }
  ];

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.userId = user.id;
        this.profile.name = user.username || this.profile.name || 'Agent';
        this.refreshProfileAndStats(user.id);
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  private refreshProfileAndStats(userId: number): void {
    this.profileService.getProfile(userId).subscribe({
      next: response => {
        const profileData = response.data;
        if (profileData?.displayName) {
          this.profile.name = profileData.displayName;
        } else {
          this.profile.name = this.profile.name || 'Agent';
        }

        if (profileData?.avatar) {
          this.profile.avatar = profileData.avatar;
        }

        if (profileData?.bio) {
          this.profile.bio = profileData.bio;
        }

        this.editForm = {
          name: this.profile.name,
          avatar: this.profile.avatar,
          bio: this.profile.bio
        };
      },
      error: () => {
        const defaultName = this.profile.name || 'Agent';
        this.profile.name = defaultName;
        this.editForm = {
          name: defaultName,
          avatar: this.profile.avatar,
          bio: this.profile.bio
        };

        this.profileService
          .createProfileIfMissing(userId, defaultName, this.profile.avatar, this.profile.bio)
          .subscribe({
            next: () => {
              this.profile.name = defaultName;
              this.editForm = {
                name: defaultName,
                avatar: this.profile.avatar,
                bio: this.profile.bio
              };
            }
          });
      }
    });

    this.profileService.getProfileStats(userId).subscribe({
      next: response => {
        const profileStats = response.data;
        this.stats = [
          { label: 'GAMES PLAYED', value: String(profileStats.gamesPlayed ?? 0) },
          { label: 'GAMES WON', value: String(profileStats.gamesWon ?? 0) },
          { label: 'BEST TIME', value: profileStats.bestTime ?? '00:00:00' },
          { label: 'BEST SCORE', value: String(profileStats.bestScore ?? 0) }
        ];
      },
      error: () => {
        this.stats = [
          { label: 'GAMES PLAYED', value: '0' },
          { label: 'GAMES WON', value: '0' },
          { label: 'BEST TIME', value: '00:00:00' },
          { label: 'BEST SCORE', value: '0' }
        ];
      }
    });
  }

  onEditProfile(): void {
    this.editForm = {
      name: this.profile.name,
      avatar: this.profile.avatar,
      bio: this.profile.bio
    };
    this.isEditing = true;
  }

  saveProfile(): void {
    if (!this.userId) {
      return;
    }

    const payload = {
      userId: this.userId,
      username: (this.editForm.name || this.profile.name || 'Agent').trim(),
      displayName: (this.editForm.name || this.profile.name || 'Agent').trim(),
      avatar: this.editForm.avatar || this.profile.avatar,
      bio: (this.editForm.bio ?? this.profile.bio ?? 'Silent, precise, and always one step ahead.').trim()
    };

    this.profileService.updateProfile(payload).subscribe({
      next: response => {
        const profileData = response.data;
        this.profile.name = profileData?.displayName || payload.displayName;
        this.profile.avatar = profileData?.avatar || payload.avatar;
        this.profile.bio = profileData?.bio || payload.bio;

        this.editForm = {
          name: this.profile.name,
          avatar: this.profile.avatar,
          bio: this.profile.bio
        };

        this.isEditing = false;
        if (this.userId !== null) {
          this.refreshProfileAndStats(this.userId);
        }
      },
      error: err => {
        console.error('Profile update failed', err);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm = {
      name: this.profile.name,
      avatar: this.profile.avatar,
      bio: this.profile.bio
    };
  }

  onBack(): void {
    this.router.navigate(['/']);
  }
}
