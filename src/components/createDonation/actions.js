export function setTitle(title) {
  return {
    type: 'create-donation/SET_TITLE',
    title,
  };
}

export function setDescription(description) {
  return {
    type: 'create-donation/SET_DESCRIPTION',
    description,
  };
}

export function addCategory(category) {
  return {
    type: 'create-donation/ADD_CATEGORY',
    category,
  };
}

export function setAllCategories(categories) {
  return {
    type: 'create-donation/SET_ALL_CATEGORIES',
    categories,
  };
}

export function setValidFrom(validFrom) {
  return {
    type: 'create-donation/SET_VALID_FROM',
    validFrom,
  };
}

export function setValidTo(validTo) {
  return {
    type: 'create-donation/SET_VALID_TO',
    validTo,
  };
}

export function setItemCondition(itemCondition) {
  return {
    type: 'create-donation/SET_ITEM_CONDITION',
    itemCondition,
  };
}

export function setCoverImage(coverImage) {
  return {
    type: 'create-donation/SET_COVER_IMAGE',
    coverImage,
  };
}

export function resetToInitialState() {
  return {
    type: 'create-donation/RESET_INITIAL_STATE',
  };
}
