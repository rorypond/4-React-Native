import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments: []}, action) => {
    switch (action.type) {

        case ActionTypes.ADD_COMMENTS:
            return {...state, errMess: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, errMess: action.payload};
        
        case ActionTypes.ADD_COMMENT:
            const comment = {...action.payload, id: state.comments.length}; 
            /**
             * const comment = action.payload;
             * comment.id = state.comment.length;
             * **/ 
            const comments =[...state.comments, comment]; //making a new array with the new comment added on,

            /**
             * **/
            return {...state, errMess: null, comments}
        default:
            return state;
    }
};