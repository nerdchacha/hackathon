import React from 'react'
import FolderOpen from '@material-ui/icons/FolderOpen'
import Description from '@material-ui/icons/Description'
import { connect } from 'react-redux'

import { listObjects, setPrefix, getDownloadLink } from '../../action/objects'

import './style.scss'

const S3Object = ({ directory, name, path, listObjects, setPrefix, onClick, getDownloadLink, isProcessingDownload }) => {
  const handleClick = () => {
    if (isProcessingDownload) { return; }
    if (!directory) { return getDownloadLink(path) }
    setPrefix(path)
    listObjects(path)
  }

  const renderFolder = <FolderOpen style={{ fontSize: 80 }} />
  const renderFile = <Description style={{ fontSize: 80 }} />
  return (
    <div className={`object-wrapper ${isProcessingDownload ? 'disabled' : ''}`} onClick={onClick || handleClick}>
      {directory ? renderFolder : renderFile}
      <span className={directory ? 'directory' : ''}>{name}</span>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isProcessingDownload: state.objects.isProcessingDownload,
})

const mapDispatchToProps = (dispatch) => ({
  listObjects: (prefix) => dispatch(listObjects(prefix)),
  setPrefix: (prefix) => dispatch(setPrefix(prefix)),
  getDownloadLink: (key) => dispatch(getDownloadLink(key))
})

export default connect(mapStateToProps, mapDispatchToProps)(S3Object)