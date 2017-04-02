import React from 'react'
import Icon from './icon'

export default ({ member, onMouseDown, onTouchStart }) => (
  <span
    className="avatar"
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
  >
    {member.avatarUrl
      ? <span className="image"><img src={member.avatarUrl} /></span>
      : <Icon name="AVATAR.DEFAULT" className="icon-avatar"/>}
      {member.admin && <Icon name="AVATAR.ADMIN" className="icon-admin"/>}
  </span>
)
