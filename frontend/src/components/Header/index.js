import React from 'react'

import './style.scss'

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <img className="logo img img-responsive" alt="logo" src="https://hackathon-public-assets.s3.amazonaws.com/qualitia-logo.png" />
      <div className="separator"></div>
      <div className="title"><span>Qualitia Build Downloader</span></div>
    </nav>
  )
}

export default Header