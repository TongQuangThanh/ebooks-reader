import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import Epub, { Book, Location, NavItem, Rendition } from 'epubjs';
import Section from 'epubjs/types/section';
import { Item } from '../searchable-list/searchable-list.component';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit {
  public chapterTitle = '';
  public currentPage!: number;
  public currentTotalPage!: number;
  public totalPage!: number;
  private book!: Book;
  private rendition!: Rendition;
  public searchItems: Item[] = [];
  public chapters: NavItem[] = [];
  public selectedChapters: string[] = [];
  public displayChapters: NavItem[] = [];
  private currentChapter!: NavItem;
  constructor(private http: HttpClient, private menuCtrl: MenuController) { }

  async ngOnInit() {
    this.book = Epub('assets/Ngao The Dan Than - Tich Tieu Tac.epub');
    // this.book.loaded.metadata.then(meta => {
    //   this.bookTitle = meta.title;
    // });
    this.storeChapters();
    this.rendition = this.book.renderTo('viewer', { flow: 'auto', width: '100%', height: '100%' });
    this.rendition.display();
    this.rendition.on('rendered', (section: Section) => {
      const currentChapter = this.book.navigation.get(section.href);
      this.chapterTitle = currentChapter ? currentChapter.label : '';
    });
    this.rendition.on('locationChanged', () => {
      const location = <Location><unknown>this.rendition.currentLocation();
      this.currentPage = location.start.displayed.page;
      this.currentTotalPage = location.start.displayed.total;
    })
    this.rendition.on('orientationchange', () => {
      console.log('orientationchange');
    })
    this.rendition.on('resized', () => {
      console.log('resized');
    })
    this.rendition.on('removed', () => {
      console.log('removed');
    })
    this.rendition.on('relocated', () => {
      // console.log('relocated');
    })
    this.rendition.on('attached', () => {
      // console.log('attached');
    })
  }

  public showNext(): void {
    this.rendition.next();
  }

  public showPrev(): void {
    this.rendition.prev();
  }

  public selectedChaptersChanged(selectedItems: string[]): void {
    const chapter = this.chapters.find(c => selectedItems[0] === c.id);
    this.rendition.display(chapter?.href);
  }

  public exit(): void { }

  private storeChapters() {
    this.book.loaded.navigation.then(navigation => {
      this.chapters = navigation.toc;
      this.searchItems = this.chapters.map(x => ({ text: x.label, value: x.id }));
      this.displayChapters = this.chapters.slice(0, 50);
    });
  }
}
