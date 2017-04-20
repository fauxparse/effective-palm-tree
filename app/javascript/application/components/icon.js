import React from 'react'
import classNames from 'classnames'
import { get } from 'lodash'

// prettier-ignore
const ICONS = {
  DEFAULT: <svg width={24} height={24} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} fill="none" stroke="#dee2e6"/></svg>,

  SIDEBAR: {
    EVENTS: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M23.5 9.5v14h-22v-14M1.5 3.5h22v6h-22zM12.5 1.5v4M6.5 1.5v4M18.5 1.5v4M9.5 16.5l2 2 5-5"/></svg>,
    PEOPLE: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M6.492 19.237L8.7 20.9c.504.378.8.97.8 1.6v1h-8v-1c0-.63.296-1.222.8-1.6l2.208-1.663M5.5 19.5a2 2 0 0 1-2-2v-1a2 2 0 1 1 4 0v1a2 2 0 0 1-2 2zM13.492 6.237L15.7 7.9c.504.378.8.97.8 1.6v1h-8v-1c0-.63.296-1.222.8-1.6l2.208-1.663M12.5 6.5a2 2 0 0 1-2-2v-1a2 2 0 1 1 4 0v1a2 2 0 0 1-2 2zM20.492 19.237L22.7 20.9c.504.378.8.97.8 1.6v1h-8v-1c0-.63.296-1.222.8-1.6l2.208-1.663M19.5 19.5a2 2 0 0 1-2-2v-1a2 2 0 1 1 4 0v1a2 2 0 0 1-2 2z"/></svg>,
    SETTINGS: <svg width={24} height={24} viewBox="0 0 24 24"><path transform="translate(.5 .5)" d="M23 12a2 2 0 0 0-2-2h-1.262a7.968 7.968 0 0 0-.852-2.058l.892-.892a2 2 0 1 0-2.828-2.828l-.892.892A7.968 7.968 0 0 0 14 4.262V3a2 2 0 0 0-4 0v1.262a7.968 7.968 0 0 0-2.058.852l-.892-.892A2 2 0 1 0 4.222 7.05l.892.892A7.968 7.968 0 0 0 4.262 10H3a2 2 0 0 0 0 4h1.262c.189.732.477 1.422.852 2.058l-.892.892a2 2 0 1 0 2.828 2.828l.892-.892a7.953 7.953 0 0 0 2.058.852V21a2 2 0 0 0 4 0v-1.262a7.968 7.968 0 0 0 2.058-.852l.892.892a2 2 0 1 0 2.828-2.828l-.892-.892A7.953 7.953 0 0 0 19.738 14H21a2 2 0 0 0 2-2zM9,12a3,3 0 1,0 6,0a3,3 0 1,0 -6,0"/></svg>,
    LOG_OUT: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M13.5 12.5v4h-5M1.5 1.5l7 5v15l-7-5v-15h12v8M11.5 9.5h11M18.5 5.5l4 4-4 4"/></svg>
  },

  AVATAR: {
    DEFAULT: <svg width={32} height={32} viewBox="0 0 32 32"><path transform="translate(.5 .5)" d="M16 22a5 5 0 0 1-5-5v-3a5 5 0 0 1 10 0v3a5 5 0 0 1-5 5zM24.07 28.647A8.18 8.18 0 0 0 18.045 26h-4.091a8.178 8.178 0 0 0-6.024 2.647M1,16a15,15 0 1,0 30,0a15,15 0 1,0 -30,0"/></svg>,
    ADMIN: <svg width={12} height={12} viewBox="0 0 12 12"><circle cx="6" cy="6" r="5.5"/><path d="M6 2l1.236 2.505L10 4.906l-2 1.95.472 2.753L6 8.309l-2.472 1.3L4 6.856l-2-1.95 2.764-.401z"/></svg>
  },

  AVAILABILITY: <svg width={24} height={24} viewBox="0 0 24 24"><g className="availability-icon"><circle cx="11.5" cy="11.5" r="11" /><g className="check"><path d="M5.5 11.5l4 4 8-8" /></g><g className="cross"><path d="M7.5 7.5l8 8" /><path d="M15.5 7.5l-8 8" /></g><g className="question"><path d="M11.5 13.5v-1c1.6 0 3-1.4 3-3s-1.4-3-3-3c-1.2 0-2.3.9-2.8 1.9" /><path d="M11.5 16.5v1" /></g></g></svg>,

  MY_AVAILABILITY: {
    AVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M9 17l4 4 10-10"/></g></svg>,
    UNAVAILABLE: <svg width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><circle cx="16" cy="16" r="15"/><path d="M22 10L10 22M22 22L10 10"/></g></svg>
  },

  CALENDAR: {
    NO_EVENTS: <svg width={24} height={24} viewBox="0 0 24 24"><circle cx="11.5" cy="11.5" r="11" /><path d="M19.277 3.723 L3.723 19.277" /></svg>
  },

  CONTROLS: {
    ADD: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M12.5 2.5v20M22.5 12.5h-20"/></svg>,
    CANCEL: <svg width={24} height={24} viewBox="0 0 24 24"><path transform="translate(.5 .5)" d="M19.8 4.2L4.2 19.8M1,12a11,11 0 1,0 22,0a11,11 0 1,0 -22,0"/></svg>,
    CARET: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M8.5 10.5 L12.5 14.5 L16.5 10.5" /></svg>,
    CHECKBOX: <svg width={24} height={24} viewBox="0 0 24 24"><circle cx="11.5" cy="11.5" r="11" /><path d="M5.5 11.5l4 4 8-8" /></svg>,
    DRAG: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M16.5 16.5l-4 4-4-4M8.5 8.5l4-4 4 4"/></svg>,
    DELETE: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M19.5 5.5l-14 14M19.5 19.5l-14-14"/></svg>,
    REMOVE: <svg width="24" height="24" viewBox="0 0 24 24"><path d="M20.5 5.5v18h-16v-18M1.5 5.5h22M12.5 11.5v6M8.5 11.5v6M16.5 11.5v6M8.5 5.5v-4h8v4"/></svg>,
    SAVE: <svg width={24} height={24} viewBox="0 0 24 24"><path d="M2.5 10.5l7 7 13-13"/></svg>
  },

  ILLUSTRATIONS: {
    ENVELOPE: <svg width="64" height="64" viewBox="0 0 64 64"><path d="M12.5 22.5l-10 5.8v34.2h60V28.3l-10-5.8M12.5 33.9V2.5h40v31.2M2.5 28.3l60 34.2M62.5 28.3L31.7 44.9M22.5 14.5h20M22.5 24.5h20"/></svg>
  },

  LOADER: <svg width={24} height={24} viewBox="0 0 24 24"><circle cx="11.5" cy="11.5" r="11" /><path d="M11.5 0.5 A 11 11 0 0 1 22.5 11.5" /></svg>,

  TABS: {
    ASSIGNMENTS: <svg width={24} height={24} viewBox="0 0 24 24"><path transform="translate(.5 .5)" d="M9 5l2 2 5-5M10 21.836c0-.604-.265-1.179-.738-1.554C8.539 19.708 7.285 19 5.5 19s-3.039.708-3.762 1.282c-.473.375-.738.95-.738 1.554V23h9v-1.164zM3,13.5a2.5,2.5 0 1,0 5,0a2.5,2.5 0 1,0 -5,0M23 21.836c0-.604-.265-1.179-.738-1.554C21.539 19.708 20.285 19 18.5 19s-3.039.708-3.762 1.282c-.473.375-.738.95-.738 1.554V23h9v-1.164zM16,13.5a2.5,2.5 0 1,0 5,0a2.5,2.5 0 1,0 -5,0"/></svg>,
    AVAILABILITY: <svg width={24} height={24} viewBox="0 0 24 24"><path transform="translate(.5 .5)" d="M6 12l4 4 8-8M1,12a11,11 0 1,0 22,0a11,11 0 1,0 -22,0"/></svg>,
    ROLES: <svg width={24} height={24} viewBox="0 0 24 24"><path transform="translate(.5 .5)" d="M14 4h9M1 4h3M22 12h1M1 12h11M14 20h9M1 20h3M4,4a3,3 0 1,0 6,0a3,3 0 1,0 -6,0M12,12a3,3 0 1,0 6,0a3,3 0 1,0 -6,0M4,20a3,3 0 1,0 6,0a3,3 0 1,0 -6,0"/></svg>
  }
}

const Icon = ({ name, className = '' }) =>
  React.cloneElement(get(ICONS, name, ICONS.DEFAULT), {
    className: classNames('icon', className)
  })

export default Icon
