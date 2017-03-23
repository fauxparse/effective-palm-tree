import React from 'react'

// prettier-ignore
const ICONS = {
  AVATAR: <svg className="icon-avatar" width="32" height="32" viewBox="0 0 32 32"><g transform="translate(.5 .5)"><path d="M16 22a5 5 0 0 1-5-5v-3a5 5 0 0 1 10 0v3a5 5 0 0 1-5 5z"/><path d="M24.07 28.647A8.18 8.18 0 0 0 18.045 26h-4.091a8.178 8.178 0 0 0-6.024 2.647"/><circle cx="16" cy="16" r="15"/></g></svg>,
  ADMIN: <svg className="icon-admin" width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5.5"/><path d="M6 2l1.236 2.505L10 4.906l-2 1.95.472 2.753L6 8.309l-2.472 1.3L4 6.856l-2-1.95 2.764-.401z"/></svg>
}

export default ({ member, onMouseDown, onTouchStart }) => (
  <span
    className="avatar"
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
  >
    {member.avatarUrl
      ? <span className="image"><img src={member.avatarUrl} /></span>
      : ICONS.AVATAR}
    {member.admin && ICONS.ADMIN}
  </span>
)
