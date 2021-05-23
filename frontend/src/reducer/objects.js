import { OBJECTS_SET_CONTENT, OBJECTS_SET_PREFIX, OBEJCTS_SET_IS_LOADING, OBEJCTS_SET_IS_PROCESSING_DOWNLOAD } from '../action/objects'

const initialState = { 
  prefix: '', 
  key: '',
  isLoading: false,
  isProcessingDownload: false,
  content: [],
}

const objects = (state = initialState, action) => {
  switch(action.type) {
    case OBJECTS_SET_CONTENT: {
      const { content } = action
      return { ...state, content }
    }
    case OBJECTS_SET_PREFIX: {
      const { prefix } = action
      return { ...state, prefix }
    }
    case OBEJCTS_SET_IS_LOADING: {
      const { isLoading } = action
      return { ...state, isLoading }
    }
    case OBEJCTS_SET_IS_PROCESSING_DOWNLOAD: {
      const { isProcessingDownload } = action
      return { ...state, isProcessingDownload }
    }
    default:
      return state
  }
}

export default objects