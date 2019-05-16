/**
 * @fileoverview Reducer function for gallery and 
 */
import { TypeKeys, ActionTypes } from '../actions/index';


/**
 * Data type for an individual image to be displayed.
 */
export interface GalleryImage {
    image: string,
    description: string,
    tag: string,
    date: string,
    active: string,
    source: string,
    org: string
}


/**
 * Data type for an array of images to be displayed.
 */
export interface GalleryImages extends Array<GalleryImage>{}


/**
 * Data type for Gallery's redux store.
 */
export interface GalleryState {
    images: GalleryImages,
    originalImages: GalleryImages,
    qtyDisplayed: number,
    isLoading: boolean,
    isMax: boolean,
    isFilteredByTag: boolean,
    isFilteredByActive: boolean,
    tagFilter: string,
    activeFilter: boolean
}


/**
 * State for gallery before any data has been loaded.
 */
const getInitialState = () => {
    return {
        images: [],
        originalImages: [], //to undo filtering
        qtyDisplayed: 0, //the end index of the array to display in list
        isLoading: false,
        isError: false,
        errorMessage: '',
        isMax: false,
        tagFilter: '',
        activeFilter: false,
        isFilteredByTag: false,
        isFilteredByActive: false,

    }
}

const galleryReducer = (state: GalleryState = getInitialState(), 
                        action: ActionTypes) => {
                            
    switch(action.type) {

        /**
         * A request for gallery data has been initiated but not
         * returned. Used to show/hide a loading indicator.
         */
        case TypeKeys.LOAD_GALLERY: {
            return { ...state, isLoading: true};   
        }

        /**
         * The request for gallery data has returned data and set the initial number
         * of images to display in the list to 4
         */
        case TypeKeys.LOAD_GALLERY_SUCCESS: {
    
            let qtyDisplayed = 0;
            if(action.images && action.images.length && action.images.length >= 4) {
                qtyDisplayed = 4;
            } else if(action.images) {
                qtyDisplayed = action.images.length; 
            }
            return { ...state, qtyDisplayed, 
                isLoading: false, 
                isError: false, 
                errorMessage:'', 
                images: action.images, 
                originalImages: action.images};   
        }

        /**
         * The request for gallery has returned an error.
         */
        case TypeKeys.LOAD_GALLERY_ERROR: {
            return { ...state, isLoading: false, isError: true, errorMessage: action.message};   
        }

        /**
         * Increments the qtyDisplayed by 4, capping at the last index of gallery images array
         */
        case TypeKeys.SHOW_NEXT_GALLERY_PAGE: {
            let qtyDisplayed = state.qtyDisplayed + 4;
            let isMax = false;
            if(state.images && state.images.length && qtyDisplayed >= state.images.length - 1) {
                isMax = true;
                qtyDisplayed = state.images.length;
            }
            return { ...state, qtyDisplayed, isMax};
        }


        /**
         * Filter images based on the actions tag property
         */
        case TypeKeys.FILTER_BY_TAG: {
            //let images = state.images.filter( (image) => image.tag === action.tag );
            return { ...state, isFilteredByTag: true, qtyDisplayed: 4, tagFilter: action.tag, images: state.images.filter( (image) => image.tag === action.tag )};
        }


        /**
         * Remove tag filter
         */
        case TypeKeys.REMOVE_TAG_FILTER: {
            return { ...state, isFilteredByTag: false, qtyDisplayed: 4, tagFilter: '', images: state.originalImages};
        }
    }

    return state;
};

export default galleryReducer;