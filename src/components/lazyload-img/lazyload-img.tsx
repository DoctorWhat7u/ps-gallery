/**
 * @fileoverview Image component using an IntersectionObserver to delay image
 * loading until the element has been scrolled into the viewport.
 * 
 * Source lightly modified from 
 * https://github.com/jgw96/st-img/blob/master/src/components/st-img/st-img.tsx
 */
import { Component, Prop, State, Element } from '@stencil/core';

@Component({
    tag: 'lazyload-img',
    styleUrl: 'lazyload-img.css',
    shadow: true
})
export class LazyloadImg {

    @Element() el: HTMLElement;
    @Prop() alt: string;
    @Prop() src: string;
    @State() prevSrc: string;

    io: IntersectionObserver;

    componentDidLoad() {
        this.addIntersectionObserver();
    }

    componentWillUpdate() {
        if (this.src !== this.prevSrc) {
            this.addIntersectionObserver();
        }
        this.prevSrc = this.src;
    }


    handleImage() {
        const image: HTMLImageElement = this.el.shadowRoot.querySelector('img');
        image.setAttribute('src', image.getAttribute('data-src'));
        image.onload = () => {
          image.removeAttribute('data-src');
        };
    }

    addIntersectionObserver() {
        if (!this.src) {
          return; 
        }
        if ('IntersectionObserver' in window) {
          this.io = new IntersectionObserver((data: any) => {
            // because there will only ever be one instance
            // of the element we are observing
            // we can just use data[0]
            if (data[0].isIntersecting) {
              this.handleImage();
              this.removeIntersectionObserver();
            }
          })
    
          this.io.observe(this.el.shadowRoot.querySelector('img'));
        } 
    }

    removeIntersectionObserver() {
        if (this.io) {
            this.io.disconnect();
            this.io = null;
          }
    }

    render() {
        return (
          <img data-src={this.src} alt={this.alt}></img>
        );
      }


}