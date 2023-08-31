import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimeTypeValidator } from './mine-type.validator';

export const Form: FormGroup = new FormGroup({
  title: new FormControl(null, {
    validators: [Validators.required, Validators.minLength(3)],
  }),
  content: new FormControl(null, {
    validators: [Validators.required],
  }),
  imageFile: new FormControl(null, {
    validators: [Validators.required],
    asyncValidators: [mimeTypeValidator],
  }),
});
