import React from 'react'

const DocHeader = props => {
  return (
    <div className="doc-header">
      <p className="doc-header-text">{props.docTitle}</p>
    </div>
  )
}

export default DocHeader;