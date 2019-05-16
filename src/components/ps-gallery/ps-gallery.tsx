import { Component, Prop, State } from '@stencil/core';
import { Store, Action } from '@stencil/redux';
import { GalleryImages } from '../../reducers/gallery';
import { loadGallery, showNextGalleryPage, filterByTag, removeTagFilter } from '../../actions/gallery';

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

  /**
   * The maximum index of the images to display.
   * We will increment it by 4 on each ionInfiniteScroll event.
   */
  @State() qtyDisplayed:number;


  loadGallery: Action;
  showNextGalleryPage: Action;
  removeTagFilter: Action;
  filterByTag: Action;

  infiniteScroll: HTMLIonInfiniteScrollElement;


  componentDidLoad() {
    // This logic would ordinarily go in a selector
    // but I seem to be maximizing complexity by trying to 
    // keep things simple: 
    this.initInfinitScroll();
    this.store.mapStateToProps(this, (state) => {
      const {
        isLoading,
        isError,
        errorMessage,
        qtyDisplayed,
        isMax,
        isFilteredByTag,
        tagFilter
      } = state.galleryReducer;

      let images = state.galleryReducer.images.slice(0, state.galleryReducer.qtyDisplayed);
  
      return { images,
        isLoading,
        isError,
        errorMessage,
        qtyDisplayed,
        isMax ,
        isFilteredByTag,
        tagFilter
      };
    });

    this.store.mapDispatchToProps(this, {
      loadGallery,
      showNextGalleryPage,
      filterByTag,
      removeTagFilter
    });

    this.loadGallery();
  }


  componentWillUnload() {
    this.infiniteScroll.removeEventListener('ionInfinite', this.handleIonInfiniteEvent);
  }


  handleIonInfiniteEvent = (event) => {
    this.showNextGalleryPage();
    setTimeout( () => {
      console.info('ionInfinite Done', event);
      this.infiniteScroll.complete();    
    }, 200);
  }

  initInfinitScroll() {
    this.infiniteScroll = (document.getElementById('infinite-scroll') as HTMLIonInfiniteScrollElement);
    this.infiniteScroll.addEventListener('ionInfinite', this.handleIonInfiniteEvent);
  }


  render() {
    return [
      <ion-header>
        <ion-toolbar color="light">
          <ion-title>Photo Gallery</ion-title>
          <ion-buttons slot="primary">
          {this.isFilteredByTag &&  
            <ion-button onClick={()=>this.removeTagFilter()}>
                  <ion-label>{this.tagFilter}</ion-label>
                  <ion-icon name="close" color="primary"></ion-icon>
              </ion-button>
            }
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

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
