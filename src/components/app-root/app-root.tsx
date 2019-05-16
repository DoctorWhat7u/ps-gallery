import { Component, Prop, State } from '@stencil/core';
import { Store } from '@stencil/redux';
import { GalleryImages } from '../../reducers/gallery';
import { configStore } from '../../store';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  @Prop({ context: 'store' }) store: Store;
  @State() gallery: GalleryImages;


  componentWillLoad() {
    this.store.setStore(configStore());
  }


  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="ps-gallery" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
