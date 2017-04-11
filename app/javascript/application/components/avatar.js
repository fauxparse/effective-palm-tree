import React from 'react'
import Icon from './icon'
import classNames from 'classnames'

export default ({ member = {}, className, onMouseDown, onTouchStart }) => (
  <span
    className={classNames('avatar', className)}
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
  >
    {member.avatarUrl
      ? <span className="image"><img src={member.avatarUrl} /></span>
      : <Icon name="AVATAR.DEFAULT" className="icon-avatar"/>}
      {member.admin && <Icon name="AVATAR.ADMIN" className="icon-admin"/>}
  </span>
)
