import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GithubRepo } from '../../models/github-repo.model';

@Component({
  selector: 'app-github-repos',
  templateUrl: './github-repos.component.html',
  styleUrls: ['./github-repos.component.scss'],
})
export class GithubReposComponent implements OnInit {
  @Input() repos: GithubRepo[] = [];
  @Input() loading = false;
  @Input() error = '';
  @Input() reposFetched = false;
  @Output() selectionChange = new EventEmitter<GithubRepo[]>();

  selected: GithubRepo[] = [];
  displayedColumns = ['select', 'name', 'language', 'stars', 'updated', 'link'];
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    this.selected = [];
    this.selectionChange.emit([]);
  }

  isSelected(repo: GithubRepo): boolean {
    return this.selected.some((r) => r.id === repo.id);
  }

  toggle(repo: GithubRepo): void {
    if (this.isSelected(repo)) {
      this.selected = this.selected.filter((r) => r.id !== repo.id);
    } else {
      this.selected = [...this.selected, repo];
    }
    this.selectionChange.emit(this.selected);
  }
}
