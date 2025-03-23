import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleComponent } from './article/article.component';

@Component({
  selector: 'app-blog',
  imports: [
    RouterOutlet,
    ArticleComponent,
  ],
  templateUrl: './blog.component.html',
})
export class BlogComponent {

}
