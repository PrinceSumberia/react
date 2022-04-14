import React, {forwardRef} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'

export type UnderlineNavProps = {
  label: string
  as: 'nav' | 'div'
  align?: 'right'
  sx: SxProp
  children: React.ReactNode
}

export const UnderlineNav = forwardRef(
  ({as = 'nav', align, label, sx: sxProp = {}, children}: UnderlineNavProps, forwardedRef) => {
    const justifyContent = align === 'right' ? 'right' : 'space-between'
    const styles = {
      display: 'flex',
      justifyContent,
      boxShadow: 'inset 0 -1px 0',
      boxShadowColor: 'fg.muted'
    }
    const ulStyles = {
      display: 'flex',
      listStyle: 'none',
      padding: '0',
      margin: '0'
    }
    return (
      <Box as={as} sx={merge(styles, sxProp)} aria-label={label} ref={forwardedRef}>
        <Box as="ul" sx={ulStyles}>
          {children}
        </Box>
      </Box>
    )
  }
)
