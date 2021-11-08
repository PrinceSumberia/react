import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {useSSRSafeId} from '@react-aria/ssr'
import styled from 'styled-components'
import {useTheme} from '../ThemeProvider'
import Box, {BoxProps} from '../Box'
import sx, {SxProp, merge} from '../sx'
import createSlots from '../utils/create-slots'
import {AriaRole} from '../utils/types'
import {ListContext} from './List'
import {Selection} from './Selection'

export const getVariantStyles = (variant: ItemProps['variant'], disabled: ItemProps['disabled']) => {
  if (disabled) {
    return {
      color: 'fg.muted',
      iconColor: 'fg.muted',
      annotationColor: 'fg.muted'
    }
  }

  switch (variant) {
    case 'danger':
      return {
        color: 'danger.fg',
        iconColor: 'danger.fg',
        annotationColor: 'fg.muted',
        hoverColor: 'actionListItem.danger.hoverText'
      }
    default:
      return {
        color: 'fg.default',
        iconColor: 'fg.muted',
        annotationColor: 'fg.muted',
        hoverColor: 'fg.default'
      }
  }
}

export type ItemProps = {
  /**
   * Primary content for an Item
   */
  children?: React.ReactNode
  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  /**
   * Is the `Item` is currently selected?
   */
  selected?: boolean
  /**
   * Style variations associated with various `Item` types.
   *
   * - `"default"` - An action `Item`.
   * - `"danger"` - A destructive action `Item`.
   */
  variant?: 'default' | 'danger'
  /**
   * Items that are disabled can not be clicked, selected, or navigated through.
   */
  disabled?: boolean
  /**
   * The ARIA role describing the function of `Item` component. `option` is a common value.
   */
  role?: AriaRole
  /**
   * id to attach to the root element of the Item
   */
  id?: string
  /**
   * Private API for use internally only. Used by LinkItem to wrap contents in an anchor
   */
  _PrivateItemWrapper?: React.FC
} & SxProp

const {Slots, Slot} = createSlots(['LeadingVisual', 'InlineDescription', 'BlockDescription', 'TrailingVisual'])
export {Slot}
export type ItemContext = Pick<ItemProps, 'variant' | 'disabled'> & {
  inlineDescriptionId: string
  blockDescriptionId: string
}

const LiBox = styled.li<SxProp>(sx)
export const TEXT_ROW_HEIGHT = '20px' // custom value off the scale

export const Item = React.forwardRef<HTMLLIElement, ItemProps>(
  (
    {
      variant = 'default',
      disabled = false,
      selected = undefined,
      onSelect = () => null,
      sx: propsSx = {},
      id,
      _PrivateItemWrapper = ({children}) => <>{children}</>,
      ...props
    },
    forwardedRef
  ): JSX.Element => {
    const {variant: listVariant, showDividers} = React.useContext(ListContext)

    const {theme} = useTheme()

    const styles = {
      display: 'flex',
      paddingX: 2,
      fontSize: 1,
      paddingY: '6px', // custom value off the scale
      lineHeight: TEXT_ROW_HEIGHT,
      marginX: listVariant === 'inset' ? 2 : 0,
      minHeight: 5,
      borderRadius: 2,
      transition: 'background 33.333ms linear',
      color: getVariantStyles(variant, disabled).color,
      textDecoration: 'none', // for as="a"
      ':not([aria-disabled])': {cursor: 'pointer'},
      '@media (hover: hover) and (pointer: fine)': {
        ':hover:not([aria-disabled])': {
          backgroundColor: `actionListItem.${variant}.hoverBg`,
          color: getVariantStyles(variant, disabled).hoverColor
        },
        ':focus:not([aria-disabled])': {
          backgroundColor: `actionListItem.${variant}.selectedBg`,
          color: getVariantStyles(variant, disabled).hoverColor,
          outline: 'none'
        },
        ':active:not([aria-disabled])': {
          backgroundColor: `actionListItem.${variant}.activeBg`,
          color: getVariantStyles(variant, disabled).hoverColor
        }
      },

      /** Divider styles */
      '[data-component="ActionList.Item--DividerContainer"]': {
        position: 'relative'
      },
      '[data-component="ActionList.Item--DividerContainer"]::before': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        width: '100%',
        top: '-7px',
        border: '0 solid',
        borderTopWidth: showDividers ? `1px` : '0',
        borderColor: 'var(--divider-color, transparent)'
      },
      // show between 2 items
      ':not(:first-of-type):not([aria-selected=true])': {'--divider-color': theme?.colors.actionListItem.inlineDivider},
      // hide divider after dividers & group header, with higher importance!
      '[data-component="ActionList.Divider"] + &': {'--divider-color': 'transparent !important'},
      // hide border on current and previous item
      '&:hover:not([aria-disabled]), &:focus:not([aria-disabled])': {'--divider-color': 'transparent'},
      '&:hover:not([aria-disabled]) + &, &:focus:not([aria-disabled]) + &': {'--divider-color': 'transparent'},
      // hide border around selected item
      '&[aria-selected=true] + &': {'--divider-color': 'transparent'}
    }

    const clickHandler = React.useCallback(
      event => {
        if (disabled) return
        if (!event.defaultPrevented) onSelect(event)
      },
      [onSelect, disabled]
    )

    // use props.id if provided, otherwise generate one.
    const labelId = useSSRSafeId(id)
    const inlineDescriptionId = useSSRSafeId(id && `${id}--inline-description`)
    const blockDescriptionId = useSSRSafeId(id && `${id}--block-description`)

    return (
      <Slots context={{variant, disabled, inlineDescriptionId, blockDescriptionId}}>
        {slots => (
          <LiBox
            ref={forwardedRef}
            sx={merge(styles, propsSx as SxProp)}
            onClick={clickHandler}
            aria-selected={selected}
            aria-disabled={disabled ? true : undefined}
            tabIndex={disabled ? undefined : -1}
            aria-labelledby={labelId}
            aria-describedby={[
              slots.InlineDescription && inlineDescriptionId,
              slots.BlockDescription && blockDescriptionId
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            <_PrivateItemWrapper>
              <Selection selected={selected} disabled={disabled} />
              {slots.LeadingVisual}
              <Box
                data-component="ActionList.Item--DividerContainer"
                sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0}}
              >
                <ConditionalBox if={Boolean(slots.TrailingVisual)} sx={{display: 'flex', flexGrow: 1}}>
                  <ConditionalBox
                    if={Boolean(slots.InlineDescription)}
                    sx={{display: 'flex', flexGrow: 1, alignItems: 'baseline', minWidth: 0}}
                  >
                    <Box as="span" id={labelId} sx={{flexGrow: slots.InlineDescription ? 0 : 1}}>
                      {props.children}
                    </Box>
                    {slots.InlineDescription}
                  </ConditionalBox>
                  {slots.TrailingVisual}
                </ConditionalBox>
                {slots.BlockDescription}
              </Box>
            </_PrivateItemWrapper>
          </LiBox>
        )}
      </Slots>
    )
  }
) as PolymorphicForwardRefComponent<'li', ItemProps>

Item.displayName = 'ActionList.Item'

const ConditionalBox: React.FC<{if: boolean} & BoxProps> = props => {
  const {if: condition, ...rest} = props

  if (condition) return <Box {...rest}>{props.children}</Box>
  else return <>{props.children}</>
}
