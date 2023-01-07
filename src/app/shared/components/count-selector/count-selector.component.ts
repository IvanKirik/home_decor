import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {

  @Input() public count: number = 1;

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public countChange() {
    this.onCountChange.emit(this.count);
  }

  public decreaseCount() {
    if (this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

  public increaseCount() {
    this.count++;
    this.countChange();
  }


}
