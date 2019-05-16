import { Component, Prop, State } from '@stencil/core';
import { Store, Action } from '@stencil/redux';
import { GalleryImages } from '../../reducers/gallery';
import { loadGallery, showNextGalleryPage, filterByTag, removeTagFilter, toggleFilterByActive } from '../../actions/gallery';

@Component({
  tag: 'ps-gallery',
  styleUrl: 'ps-gallery.css'
})
export class PsGallery {

  @Prop({ context: 'store' }) store: Store;
  @State() images: GalleryImages;
  @State() isLoading: boolean;
  @State() isError: boolean;
  @State() errorMessage: string;
  @State() isMax: boolean;
  @State() isFilteredByTag: boolean;
  @State() tagFilter: string;
  @State() isFilteredByActive: boolean;

  /**
   * The maximum index of the images to display.
   * We will increment it by 4 on each ionInfiniteScroll event.
   */
  @State() qtyDisplayed:number;


  loadGallery: Action;
  showNextGalleryPage: Action;
  removeTagFilter: Action;
  filterByTag: Action;
  toggleFilterByActive: Action;

  infiniteScroll: HTMLIonInfiniteScrollElement;
  filterActiveToggle: HTMLIonToggleElement;


  componentDidLoad() {
    // This logic would ordinarily go in a selector
    // but I seem to be maximizing complexity by trying to 
    // keep things simple: 
    this.initInfinitScroll();
    this.initActiveFilterToggle();

    this.store.mapStateToProps(this, (state) => {
      const {
        isLoading,
        isError,
        errorMessage,
        qtyDisplayed,
        isMax,
        isFilteredByTag,
        tagFilter,
        isFilteredByActive
      } = state.galleryReducer;

      let images = state.galleryReducer.images.slice(0, state.galleryReducer.qtyDisplayed);
  
      return { images,
        isLoading,
        isError,
        errorMessage,
        qtyDisplayed,
        isMax ,
        isFilteredByTag,
        tagFilter,
        isFilteredByActive
      };
    });

    this.store.mapDispatchToProps(this, {
      loadGallery,
      showNextGalleryPage,
      filterByTag,
      removeTagFilter,
      toggleFilterByActive
    });

    this.loadGallery();
  }


  componentWillUnload() {
    this.infiniteScroll.removeEventListener('ionInfinite', this.handleIonInfiniteEvent);
    this.filterActiveToggle.removeEventListener('ionChange', this.handleChangeFilterActive);
  }


  handleIonInfiniteEvent = (event:CustomEvent) => {
    this.showNextGalleryPage();
    setTimeout( () => {
      console.info('ionInfinite Done', event);
      this.infiniteScroll.complete();    
    }, 200);
  }

  handleChangeFilterActive = (event:CustomEvent) => {
      console.info('toggle filter active', this.isFilteredByActive, event.target);
      this.toggleFilterByActive(!this.isFilteredByActive);
  };

  initInfinitScroll() {
    this.infiniteScroll = (document.getElementById('infinite-scroll') as HTMLIonInfiniteScrollElement);
    this.infiniteScroll.addEventListener('ionInfinite', this.handleIonInfiniteEvent);
  }

  initActiveFilterToggle() {
    this.filterActiveToggle = (document.getElementById('filter-active-toggle') as HTMLIonToggleElement);
    this.filterActiveToggle.addEventListener('ionChange', this.handleChangeFilterActive);
  }


  render() {
    return [
      <ion-header>
        <ion-toolbar color="light">
          <ion-title>Photo Gallery</ion-title>
          <ion-buttons slot="primary">
          {this.isFilteredByTag &&  
            <ion-button  mode="ios" fill="solid" color="primary" onClick={()=>this.removeTagFilter()}>
              <ion-label>{this.tagFilter}</ion-label>
              <ion-icon slot="end" name="close" color="secondary"></ion-icon>
            </ion-button>
            }
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      
       <ion-list>
       <ion-item>
         <ion-label>Hide inactive</ion-label>
         <ion-toggle id="filter-active-toggle" slot="end" color="primary" checked={this.isFilteredByActive}></ion-toggle>
         </ion-item>
       </ion-list>,
      <ion-content>
        {this.isLoading &&  
          <ion-spinner name="bubbles"></ion-spinner>
        }
       <ion-list>
       {this.images && this.images.map( (image) =>
        <ion-item>
            <div class='image-item-container'>
              <lazyload-img src={image.image}></lazyload-img>
              <div class="image-item-metadata">
              <ion-text color="primary">
                <h4>{image.date}</h4>
              </ion-text>
              
                <p>{image.description}</p>
                <p>
                <ion-chip onClick={()=>this.filterByTag(image.tag)}>
                  <ion-icon name="pricetag"></ion-icon>
                  <ion-label>{image.tag}</ion-label>
                </ion-chip>
                </p>
              </div>
            </div>
          </ion-item>
        )}
       </ion-list>
        <ion-infinite-scroll threshold="100px" id="infinite-scroll" disabled={this.isMax}>
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more data...">
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    ];
  }
}
