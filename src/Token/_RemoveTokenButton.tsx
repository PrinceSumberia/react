import { XIcon } from '@primer/octicons-react'
import styled from 'styled-components'
import { defaultTokenSize, tokenSizes, TokenSizeKeys } from "./TokenBase"
import { TokenButtonProps, tokenButtonStyles, variants, getTokenButtonIconSize } from './_tokenButtonUtils'

const RemoveTokenButton = styled.span.attrs<TokenButtonProps>(({parentTokenTag, variant, ...rest}) => {
    delete rest.children;

    return ({
        as: parentTokenTag === 'span' ? 'button' : 'span',
        tabIndex: -1,
        className: '_TokenButton',
        children: <XIcon size={getTokenButtonIconSize(variant)} /> // TODO: figure out how to set `size` using `fontSizes` from Primitives
    })
})<TokenButtonProps>`
    ${tokenButtonStyles}
    ${variants}
`;

RemoveTokenButton.defaultProps = {
    variant: defaultTokenSize
}

export default RemoveTokenButton;