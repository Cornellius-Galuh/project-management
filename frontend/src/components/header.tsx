import React from 'react'

interface HeaderProps{
    title: string
    children?: React.ReactNode
}

const Header = ({title, children}: HeaderProps) => {
  return (
    <div className='flex item-center justify-between border-b mb-5'>
      <h2 className='text-2xl font-bold mb-6'>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

export default Header
