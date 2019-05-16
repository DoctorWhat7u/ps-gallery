import {
    LoadGalleryAction,
    LoadGallerySuccessAction,
    LoadGalleryErrorAction,
    ShowNextGalleryPageAction,
    FilterByTagAction,
    RemoveTagFilterAction,
    FilterByActiveAction
} from './gallery';

export enum TypeKeys {
    NULL = 'NULL',
    ERROR = 'ERROR',
    LOAD_GALLERY = 'LOAD_GALLERY',
    LOAD_GALLERY_SUCCESS = 'LOAD_GALLERY_SUCCESS',
    LOAD_GALLERY_ERROR = 'LOAD_GALLERY_ERROR',
    SHOW_NEXT_GALLERY_PAGE = 'SHOW_NEXT_GALLERY_PAGE',
    FILTER_BY_TAG = 'FILTER_BY_TAG',
    REMOVE_TAG_FILTER = 'REMOVE_TAG_FILTER',
    FILTER_BY_ACTIVE = 'FILTER_BY_ACTIVE'
};

export interface NullAction {
    type: TypeKeys.NULL
};

export type ActionTypes =
    | NullAction
    | LoadGalleryAction
    | LoadGallerySuccessAction
    | LoadGalleryErrorAction
    | ShowNextGalleryPageAction
    | FilterByTagAction
    | RemoveTagFilterAction
    | FilterByActiveAction
;