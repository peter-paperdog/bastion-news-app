import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
  ],
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent {
  @Input() options: string[] = [];
  @Input() selectedOption: string = '';
  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();

  isOpen: boolean = false;

  constructor() {}

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string, event: Event): void {
    event.stopPropagation();
    this.selectedOption = option;
    this.isOpen = false;
    this.optionSelected.emit(option);
  }
  openDropdown() {
    this.isOpen = true;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
