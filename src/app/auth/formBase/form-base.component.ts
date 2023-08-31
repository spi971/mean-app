import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form-base',
  templateUrl: 'form-base.component.html',
  styleUrls: ['form-base.component.css'],
})
export class FormBaseComponent implements OnInit {
  @Output() formValues: EventEmitter<NgForm> = new EventEmitter();
  @Input({ required: true }) buttonName: string;
  isLoading = false;
  constructor() {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.formValues.emit(form);
  }
}
