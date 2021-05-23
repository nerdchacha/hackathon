import StreamSaver from 'streamsaver'
import { push } from 'connected-react-router'

import { LOCALSTORAGE_KEY, AUTH_SERVICE_URL } from '../constants'

export const OBJECTS_SET_PREFIX = 'OBJECTS_SET_PREFIX'
export const OBJECTS_SET_KEY = 'OBJECTS_SET_KEY'
export const OBJECTS_SET_CONTENT = 'OBJECTS_SET_CONTENT'
export const OBEJCTS_SET_IS_LOADING = 'OBEJCTS_SET_IS_LOADING'
export const OBEJCTS_SET_IS_PROCESSING_DOWNLOAD = 'OBEJCTS_SET_IS_PROCESSING_DOWNLOAD'

const getName = (key) => {
  if (!key) { return '' }
  const parts = key.split('/')
  if (!parts.length) { return '' }
  return parts[parts.length - 1] === '' ? parts[parts.length - 2] : parts[parts.length - 1]
}

export const setPrefix = (prefix) => ({
  type: OBJECTS_SET_PREFIX,
  prefix
})

export const setContent = (content) => ({
  type: OBJECTS_SET_CONTENT,
  content,
})

export const setIsLoading = (isLoading) => ({
  type: OBEJCTS_SET_IS_LOADING,
  isLoading,
})

export const setIsProcessingDownload = (isProcessingDownload) => ({
  type: OBEJCTS_SET_IS_PROCESSING_DOWNLOAD,
  isProcessingDownload,
})

export const listObjects = (prefix) => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}api/list?prefix=${prefix}&delimiter=/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(LOCALSTORAGE_KEY)}`
      }
    })
    const json = await response.json();
    const { Contents: objects, CommonPrefixes: directories } = json;
    const content = []
    directories.forEach((item) => { content.push({name: getName(item.Prefix), path: item.Prefix, directory: true }) } )
    objects.filter((item) => item.Key !== json.Prefix).forEach((item) => { content.push({name: getName(item.Key), path: item.Key, directory: false}) })
    dispatch(setContent(content))
    dispatch(setIsLoading(false))
  } catch (e) {
    localStorage.removeItem(LOCALSTORAGE_KEY)
    dispatch(push('/'))
  }
}

export const getDownloadLink = (key) => async (dispatch) => {
  try {
    dispatch(setIsProcessingDownload(true))
    const response = await fetch(`${AUTH_SERVICE_URL}api/get-object?key=${key}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(LOCALSTORAGE_KEY)}`
      }
    })
    const fileStream = StreamSaver.createWriteStream(key);
    const writer = fileStream.getWriter();
    if (response.body.pipeTo) {
      writer.releaseLock();
      dispatch(setIsProcessingDownload(false))
      return response.body.pipeTo(fileStream);
    }
    const reader = response.body.getReader();
    const pump = () => reader.read().then(({ value, done }) => (done ? writer.close() : writer.write(value).then(pump)));
    pump();
    dispatch(setIsProcessingDownload(false))
  } catch (e) {
    localStorage.removeItem(LOCALSTORAGE_KEY)
    dispatch(push('/'))
  }
}