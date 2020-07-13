import React from 'react'
import { SocialIcons } from './SocialIcons'
import { ReactComponent as TCHLogo } from '../assets/images/themes/core/logos/thai-chain-logo.svg'

export const Footer = () => (
  <footer className="footer">
    <div className="container">
      <a href="https://thaichain.io/" target="_blank" className="footer-logo-container">
        <TCHLogo width={120}/>
      </a>
      <p>Thaichainbridge v1.00</p>
      <SocialIcons />
    </div>
  </footer>
)
