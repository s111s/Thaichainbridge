import React from 'react'
import { MenuItems } from './MenuItems'
import { Wallet } from './Wallet'
import { ReactComponent as TutorialIcon } from '../assets/images/themes/core/logos/icon-tutorial.svg'

export const HeaderMenu = ({ withoutEvents }) => (
  <div className="header-menu">
    <MenuItems withoutEvents={withoutEvents} />
    <Wallet />
    <a href="https://thunder-docs.s3-us-west-2.amazonaws.com/ThunderStableCoinTutorial.pdf"
      target="_blank"
      className="menu-items" onClick={withoutEvents.onMenuToggle}>
      <span className="menu-items-icon"><TutorialIcon width="26" height="26" /></span>
      <span className="menu-items-text">Tutorial</span>
    </a>
  </div>
)
