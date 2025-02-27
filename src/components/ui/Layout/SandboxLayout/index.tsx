import React, { FC } from 'react'

interface Props {
  children: React.ReactNode
  layoutId: string
}

const SandBoxLayout: FC<Props> = ({
  children,
  layoutId,
}): React.JSX.Element => {
  return (
    <div
      id={layoutId}
      className="m-2 flex flex-col items-start gap-2 border p-2"
    >
      {children}
    </div>
  )
}

export default SandBoxLayout
