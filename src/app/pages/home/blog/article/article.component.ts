import { Component, input } from '@angular/core';

@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article.component.html',
})
export class ArticleComponent {
  id = input.required<string>();
}
