import { compose, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';

const loggerMiddleware = createLogger();
const createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware)
)(createStore);
function configureStore(initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}
const store = configureStore();

export default store;
