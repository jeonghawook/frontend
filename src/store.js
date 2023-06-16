import { createStore } from 'redux';


const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  nickname: '',
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        isAdmin: action.payload.isAdmin,
        nickname: action.payload.nickname,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};


const store = createStore(reducer);

export default store;
