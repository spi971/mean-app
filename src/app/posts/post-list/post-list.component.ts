import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.component.html',
  styleUrls: ['post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  private postSubscription: Subscription;
  public isLoading: boolean = false;
  //Paginator config
  public postsCount = 0;
  public postsPerPage = 2;
  public pageIndex = 0;
  public currentPage = 1;
  public pageSizeOptions = [2, 5, 10];
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  isConnected = true;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(
      this.postsPerPage,
      this.pageIndex + this.currentPage
    );

    this.postSubscription = this.postsService
      .getUpdatedPostsListener()
      .subscribe((postData: { posts: Post[]; postsCount: number }) => {
        const { posts, postsCount } = postData;

        this.isLoading = false;
        this.posts = posts;
        this.postsCount = postsCount;
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    const { pageSize, pageIndex } = pageData;

    this.postsPerPage = pageSize;
    this.currentPage = pageIndex + 1;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
