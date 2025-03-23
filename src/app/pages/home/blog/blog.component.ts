import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [
    RouterOutlet,
    NgFor,
  ],
  templateUrl: './blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  randomDelay(): string {
    return `${this.getRandomInt(0, 5)}s`;
  }

  randomDuration(): string {
    return `${this.getRandomInt(3, 6)}s`;
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
