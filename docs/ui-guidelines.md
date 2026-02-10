# UI Guidelines

## Design Principles

The app should embody the concept of a "window" - feeling light, airy, warm, and visually pleasing. The UI should create an inviting and calming user experience.

## Visual Design

### Color Palette

- Soft, warm tones with light backgrounds (whites, creams, soft pastels) inspired by natural light through a window
- Use color intentionally to convey meaning without relying solely on color (see Accessibility)
- Maintain sufficient contrast ratios for readability

### Typography

- Clean, readable sans-serif fonts with generous line spacing for an airy feel
- Use clear hierarchy with appropriate font sizes and weights
- Ensure text remains legible at various zoom levels
- **All labels should use lowercase** to create a friendly, approachable look that aligns with the light and warm aesthetic

### Spacing

- Ample whitespace between elements to maintain the light, uncluttered aesthetic
- Consistent padding and margins throughout the application
- Allow UI elements room to breathe

### Visual Style

- Subtle shadows and transparency effects to evoke the feeling of glass/windows
- Minimalist, line-based icons that don't feel heavy
- Avoid visual clutter and overwhelming decorative elements

### Transitions & Animations

- Smooth, gentle animations that feel natural and calming
- Transitions should be meaningful and not distract from content
- Provide options to reduce motion for users who prefer it

## Accessibility Requirements

### Keyboard Navigation

- All interactive elements must be fully keyboard accessible
- Provide visible focus indicators for keyboard navigation
- Support standard keyboard shortcuts and tab order

### Screen Reader Support

- Use semantic HTML elements appropriately
- Provide meaningful ARIA labels where necessary
- Ensure all images have descriptive alt text
- Announce dynamic content updates to assistive technologies

### Visual Accessibility

- Maintain WCAG 2.1 AA compliance minimum (AAA where possible)
- Ensure color contrast ratios meet or exceed 4.5:1 for normal text, 3:1 for large text
- Do not rely solely on color to convey information
- Support system font size preferences and text scaling up to 200%

### Motor & Interaction

- Provide sufficiently large touch targets (minimum 44x44 pixels)
- Allow adequate time for interactions without timeouts
- Avoid requiring precise gestures or timing
- Support multiple input methods (mouse, touch, keyboard)

### Cognitive Accessibility

- Use clear, simple language throughout the interface
- Provide consistent navigation and layout patterns
- Offer clear error messages with guidance on how to resolve issues
- Allow users to review and confirm important actions

### Responsive Design

- Support multiple screen sizes and orientations
- Ensure functionality at various zoom levels (up to 200%)
- Adapt layout gracefully for different viewport sizes
