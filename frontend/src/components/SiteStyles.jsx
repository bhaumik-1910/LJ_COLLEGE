import React from 'react'

// Default CSS variable values aligned with styles in src/styles.css
const defaultVars = {
    '--bg': '#0b1020',
    '--panel': '#111733',
    '--muted': '#9aa4bf',
    '--text': '#e6ebff',
    '--brand': '#5b8cff',
    '--brand2': '#7bffbd',
    '--accent': '#ffc857',
    '--glass': 'rgba(17, 23, 51, 0.5)',
    '--ring': 'rgba(91, 140, 255, .3)'
}

/**
 * SiteStyles
 * Injects CSS variables into the document via a scoped <style> tag.
 * Pass a `variables` object to override any of the defaults above, e.g.
 * <SiteStyles variables={{ '--brand': '#ff6b6b' }} />
 */
const SiteStyles = ({ variables = {} }) => {
    const vars = { ...defaultVars, ...variables }
    const css = `:root{ ${Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(' ')} }`
    return <style>{css}</style>
}

export default SiteStyles
