import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books = [];
  constructor() { }

  ngOnInit() {
    console.log();
    
  }

  onClick() {
    Filesystem.readdir({
      path: 'file://',
      directory: Directory.Library
    }).then(x => {
      console.log(x);
    })
  }
}
