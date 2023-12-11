import React from 'react'
import './Logo.css'

function Logo() {
  return (
    <div class="logo" data-text="Awesome">
    <span class="actual-text">&nbsp;get started&nbsp;</span>
    <span aria-hidden="true" class="hover-text">&nbsp;get started&nbsp;</span>
</div>
  )
}

export default Logo