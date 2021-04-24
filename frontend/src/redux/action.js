import {
    SET_BORROWED_BOOKS,
    SET_USER,
    SET_BOOK_LIST,
    DELETE_FROM_BORROWED_BOOKS,
    ADD_TO_BORROWED_BOOKS,
} from './type';


export const setCurrentUser = user => {
    return {
        type: SET_USER,
        user: user,
    };
};

export const setBorrowedBooks = books => {
    return {
        type: SET_BORROWED_BOOKS,
        books: books,
    }
}

export const setBookList = books => {
    return {
        type: SET_BOOK_LIST,
        books: books,
    }
}

export const deleteFromBorrowedBooks = book => {
    return {
        type: DELETE_FROM_BORROWED_BOOKS,
        book: book
    }
}

export const addToBorrowedBooks = book => {
    return {
        type: ADD_TO_BORROWED_BOOKS,
        book: book,
    }
}