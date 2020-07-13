import React from 'react'
import { ReactComponent as StatusIcon } from '../assets/images/themes/core/logos/icon-status.svg'
import { ReactComponent as StatisticsIcon } from '../assets/images/themes/core/logos/icon-statistics.svg'
import { Link } from 'react-router-dom'

export const MenuItems = ({ onMenuToggle = null, withoutEvents }) => {
  const menuItems = [
    /*{
      hide: withoutEvents,
      icon: <EventsIcon />,
      link: '/events',
      text: 'Events'
    },*/
    {
      hide: false,
      icon: <StatusIcon width="26" height="26" />,
      link: '/status',
      text: 'Status'
    },
    {
      hide: withoutEvents,
      icon: <StatisticsIcon width="26" height="26" />,
      link: '/statistics',
      text: 'Statistics'
    }
  ]

  return menuItems.map((item, index) => {
    return (
      <Link key={index} to={item.link} className="menu-items" onClick={onMenuToggle}>
        <span className="menu-items-icon">{item.icon}</span>
        <span className="menu-items-text">{item.text}</span>
      </Link>
    )
  })
}
