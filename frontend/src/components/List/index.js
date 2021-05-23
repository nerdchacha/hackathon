import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Loop from '@material-ui/icons/Loop'

import { listObjects, setPrefix } from '../../action/objects'
import { LOCALSTORAGE_KEY } from '../../constants'
import Object from '../Object'

import './style.scss'

const List = (props) => {
  const handleUpClick = () => {
    const parts = props.prefix.split('/')
    parts.pop()
    parts.pop()
    const upDirectory = parts.length ? `${parts.join('/')}/` : ''
    props.setPrefix(upDirectory)
    props.listObjects(upDirectory)
  }

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCALSTORAGE_KEY)
    if (!accessToken) { return props.push('/') }
    const { listObjects, prefix } = props
    listObjects(prefix)
  }, [])

  const renderObjects = props.content.map((item, i) => <Object {...item} key={item.path} />)
  const renderUpDirectory = props.prefix === '' ? '' : <Object name=".." directory onClick={handleUpClick} />

  const renderAllObjects = (
    <React.Fragment>
      {renderUpDirectory}
      {renderObjects}
    </React.Fragment>
  )

  const renderLoader = (
    <Loop className="loader" style={{ fontSize: 80 }}/>
  )

  return (
    <div className="list-page">
      <div className="objects-container">
        {props.isLoading ? renderLoader : renderAllObjects}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  prefix: state.objects.prefix,
  content: state.objects.content,
  isLoading: state.objects.isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  push: (path) => dispatch(push(path)),
  listObjects: (prefix) => dispatch(listObjects(prefix)),
  setPrefix: (prefix) => dispatch(setPrefix(prefix))
})

export default connect(mapStateToProps, mapDispatchToProps)(List)