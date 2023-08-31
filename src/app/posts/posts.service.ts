import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<{ posts: Post[]; postsCount: number }>();
  private apiUrl: string = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient, private router: Router) {}

  getUpdatedPostsListener() {
    return this.updatedPosts.asObservable();
  }

  navigateTo(path: string) {
    return this.router.navigate([path]);
  }

  formatPosts(postData) {
    return postData.posts.map((post: any) => {
      return {
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath,
      };
    });
  }

  getPosts(postPerpage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerpage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; postsCount: number }>(
        this.apiUrl + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: this.formatPosts(postData),
            postsCount: postData.postsCount,
          };
        })
      )
      .subscribe((tranformedPostsData) => {
        this.posts = tranformedPostsData.posts;
        this.updatedPosts.next({
          posts: [...this.posts],
          postsCount: tranformedPostsData.postsCount,
        });
      });
  }

  getPost(postId: string) {
    return this.http.get<{ message: string; post: any }>(this.apiUrl + postId);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(this.apiUrl, postData)
      .subscribe((serverResponseData) => {
        this.navigateTo('/');
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image as string,
      };
    }
    this.http
      .put<{ message: string; imagePath: string }>(this.apiUrl + id, postData)
      .subscribe((serverResponseData) => {
        this.navigateTo('/');
      });
  }

  deletePost(postId: string) {
    return this.http.delete(this.apiUrl + postId);
  }
}
