import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Form } from './form';

@Component({
  selector: 'app-post-create',
  styleUrls: ['post-create.component.css'],
  templateUrl: 'post-create.component.html',
})
export class PostCreateComponent implements OnInit {
  title: string = '';
  content: string = '';
  public formMode: string = 'create';
  private postId: string = '';
  public post: Post;
  isLoading: boolean;
  form = Form;
  public imagePreview: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('postId')) {
        this.formMode = 'edit';
        this.isLoading = true;

        this.postId = params.get('postId');
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          const { _id, title, content, imagePath } = postData.post;

          this.post = {
            id: _id,
            title: title,
            content: content,
            imagePath: imagePath,
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            imageFile: this.post.imagePath,
          });
        });
      } else {
        this.formMode = 'create';
        this.postId = '';
      }
    });
  }

  createImagePreview(imageFile: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(imageFile);
  }
  onChoosingImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files[0];
    this.form.patchValue({ imageFile: file });
    this.form.get('imageFile').updateValueAndValidity();
    this.createImagePreview(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { title, content, imageFile } = this.form.value;

    if (this.formMode === 'edit') {
      this.postsService.updatePost(this.postId, title, content, imageFile);
    } else {
      this.postsService.addPost(title, content, imageFile);
    }
    this.form.reset();
  }
}
