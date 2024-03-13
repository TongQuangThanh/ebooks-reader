import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
export interface Item {
  text: string;
  value: string;
}
@Component({
  selector: 'app-searchable-list',
  templateUrl: './searchable-list.component.html',
  styleUrls: ['./searchable-list.component.scss']
})
export class SearchableListComponent implements OnInit {
  @Input() items: Item[] = [];
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';
  @Input() selectMode: 'none' | 'single' | 'multiple' = 'multiple';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();

  filteredItems: Item[] = [];
  displayItems: Item[] = [];
  workingSelectedValues: string[] = [];

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValues = [...this.selectedItems];
    this.resetDisplay();
  }

  private resetDisplay() {
    this.displayItems = this.filteredItems.slice(0, 50);
  }

  public trackItems(index: number, item: Item) {
    return item.value;
  }

  public cancelChanges() {
    this.selectionCancel.emit();
  }

  public confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  selectItem(item: Item) {
    this.selectionChange.emit([item.value]);
  }

  public onIonInfinite(ev: InfiniteScrollCustomEvent): void {
    const oldLen = this.displayItems.length;
    for (let i = oldLen; i < (oldLen + 100); i++) {
      if (this.filteredItems[i]) {
        this.displayItems.push(this.filteredItems[i]);
      }
    }
    ev.target.complete();
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  public filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return item.text.toLowerCase().includes(normalizedQuery);
      });
    }
    this.resetDisplay();
  }

  public isChecked(value: string) {
    return this.workingSelectedValues.find((item) => item === value);
  }

  checkboxChange(ev: any) {
    const { checked, value } = ev.detail;

    if (checked) {
      this.workingSelectedValues = [...this.workingSelectedValues, value];
    } else {
      this.workingSelectedValues = this.workingSelectedValues.filter((item) => item !== value);
    }
  }
}
