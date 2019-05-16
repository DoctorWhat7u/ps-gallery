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
  
  componentDidLoad() {

    // This logic would ordinarily go in a selector
    // but I seem to be maximizing complexity by trying to 
    // keep things simple: 

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

    this.initInfinitScroll();
    
  }

  initInfinitScroll() {
    const infiniteScroll = document.getElementById('infinite-scroll');

    infiniteScroll.addEventListener('ionInfinite', (event) => {
      
      this.showNextGalleryPage();

      setTimeout(function() {
        console.info('ionInfinite Done', event);
        let infiniteScrollComponent = (event.target as HTMLIonInfiniteScrollElement)
        infiniteScrollComponent.complete();
        if(this.isMax) {
          infiniteScrollComponent.disabled = true;
        }
      }, 500);
    });
  }


  filterByTag(tag:string) {
    console.info('clicked filter by ' + tag);
    this.filterByTag(tag);
  }


  render() {
    return [
      <ion-header>
        <ion-toolbar color="light">
          <ion-title>Photo Gallery</ion-title>

          {this.isFilteredByTag && 
          <ion-buttons slot="primary">
            <ion-button onClick={()=>this.removeTagFilter()}>
               
                  <ion-icon name="pricetag" color="primary"></ion-icon>
                  <ion-label>{this.tagFilter}</ion-label>
                  <ion-icon name="close"></ion-icon>
               
              </ion-button>
          </ion-buttons>
          }

        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
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
        <ion-infinite-scroll threshold="15%" id="infinite-scroll">
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more data...">
        
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>

        
      
    ];
  }
}
