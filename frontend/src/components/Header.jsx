import { NavLink } from 'react-router-dom'

export default function Header( {children} ) {
  return (
    <header className="site-header">
      <h1>SmartStudy</h1>
        {children}
    </header>
  )
}