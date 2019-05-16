
import { GalleryImages } from '../reducers/gallery';
import { TypeKeys } from '../actions/index';

export interface LoadGalleryAction {
    type: TypeKeys.LOAD_GALLERY
};


export interface LoadGallerySuccessAction {
    type: TypeKeys.LOAD_GALLERY_SUCCESS,
    images: GalleryImages
};


export interface LoadGalleryErrorAction {
    type: TypeKeys.LOAD_GALLERY_ERROR,
    message: string
};

export interface ShowNextGalleryPageAction {
    type: TypeKeys.SHOW_NEXT_GALLERY_PAGE
};

export interface FilterByTagAction {
    type: TypeKeys.FILTER_BY_TAG,
    tag: string
};

export interface RemoveTagFilterAction {
    type: TypeKeys.REMOVE_TAG_FILTER,
    tag: string
};

/**
 * Thunk action creator to fetch the gallery json data. 
 */
export const loadGallery = () => async(dispatch, _getState) => {

    dispatch({
        type: TypeKeys.LOAD_GALLERY
    });


    return fetch('http://gsx2json.com/api?id=1wZa0Gx2yAFDyMVayzRn428SDXCOJHOL-0_IX9uLiWW0')
        .then(
            response => response.json(),
            error => {
                dispatch({
                    type: TypeKeys.LOAD_GALLERY_ERROR,
                    message: error.message
                });
            }
        )
        .then(
            json => dispatch({
                type: TypeKeys.LOAD_GALLERY_SUCCESS,
                images: json.rows
            })
        )
};


export const showNextGalleryPage = () => async(dispatch) => {
    return dispatch({
        type: TypeKeys.SHOW_NEXT_GALLERY_PAGE
    });
};


export const filterByTag = (tagValue:string) => async(dispatch) => {
    return dispatch({
        type: TypeKeys.FILTER_BY_TAG,
        tag: tagValue
    });
};


export const removeTagFilter = () => async(dispatch) => {
    return dispatch({
        type: TypeKeys.REMOVE_TAG_FILTER
    });
};