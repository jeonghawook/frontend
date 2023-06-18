import { legacy_createStore as createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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
        email: action.payload.email,
        userId: action.payload.userId,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
