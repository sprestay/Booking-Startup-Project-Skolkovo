import {
    SET_BORROWED_BOOKS,
    SET_USER,
    SET_BOOK_LIST,
    DELETE_FROM_BORROWED_BOOKS,
    ADD_TO_BORROWED_BOOKS,
} from './type';

const initialState = {
    user: null,
    borrowedBooks: [],
    books: [],
    isLogin: false,
}

export default function(oldState = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...oldState, 
                user: action.user,
            };
        case SET_BORROWED_BOOKS:
            return {
                ...oldState, 
                borrowedBooks: action.books,
            };
        case SET_BOOK_LIST:
            return {
                ...oldState,
                books: action.books,
            };
        case DELETE_FROM_BORROWED_BOOKS:
            return {
                ...oldState,
                borrowedBooks: oldState.borrowedBooks.filter(item => item.bookID != action.book.bookID),
            };
        case ADD_TO_BORROWED_BOOKS:
            return {
                ...oldState,
                borrowedBooks: oldState.borrowedBooks.concat(action.book),
            }
        default:
            return oldState;
    }
}