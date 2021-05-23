import React from 'react'
import { Link } from 'react-router-dom'

import './style.scss'

const NoAccess = () => {
  return (
    <div className="no-access-page">
      <div className="container">
        <p>Sorry, there was some issue trying to log you in</p>
        <Link className="btn" to="/">Login Page</Link>
      </div>
    </div>
  )
}

export default NoAccess