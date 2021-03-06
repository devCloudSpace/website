import initialState from './initialState';

const createDonationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'create-donation/SET_TITLE':
      return {
        ...state,
        title: action.title,
      };

    case 'create-donation/SET_DESCRIPTION':
      return {
        ...state,
        description: action.description,
      };

    case 'create-donation/ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.category],
      };

    case 'create-donation/SET_ALL_CATEGORIES':
      return {
        ...state,
        categories: action.categories,
      };
    case 'create-donation/SET_VALID_FROM':
      return {
        ...state,
        validFrom: action.validFrom,
      };

    case 'create-donation/SET_VALID_TO':
      return {
        ...state,
        validTo: action.validTo,
      };

    case 'create-donation/SET_ITEM_CONDITION':
      return {
        ...state,
        itemCondition: action.itemCondition,
      };

    case 'create-donation/SET_COVER_IMAGE':
      return {
        ...state,
        coverImage: action.coverImage,
      };

    case 'create-donation/RESET_INITIAL_STATE':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default createDonationReducer;
