import clsx from 'clsx'
import React from 'react'

// type Variant = 'header1' | 'header2' | 'header3' | 'body1' | 'body2'

type Variant =
  | 'text-header1'
  | 'text-title'
  | 'text-header2'
  | 'text-header3'
  | 'text-subtitle1'
  | 'text-subtitle2'
  | 'text-medium'
  | 'text-button1'
  | 'text-button2'
  | 'text-button3'
  | 'text-button4'
  | 'text-button5'
  | 'text-button6'
  | 'text-tab'
  | 'text-table'
  | 'text-body24'
  | 'text-body1'
  | 'text-body2'
  | 'text-body3'
  | 'text-small1'
  | 'text-small2'
  | 'text-small3'
  | 'text-smaller1'
  | 'text-smaller2'
  | 'text-smaller3'
  | 'text-smaller4'
  | 'text-link1'

interface TextProps<C extends React.ElementType> {
  as?: C
  variant?: Variant | 'body1'
}

type Props<C extends React.ElementType> = React.PropsWithChildren<
  TextProps<C>
> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof TextProps<C>>

const Text = <C extends React.ElementType = 'span'>({
  as,
  children,
  variant,
  className,
  ...restProps
}: Props<C>) => {
  const Component = as || 'span'

  return (
    <Component
      {...restProps}
      className={clsx(className, {
        [`${variant}`]: variant,
      })}
    >
      {children}
    </Component>
  )
}

export default Text
