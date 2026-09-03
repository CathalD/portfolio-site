---
# SCAFFOLDING FIXTURE — NOT REAL CONTENT.
#
# This file exists so that the /writing index and the long-form article layout
# can be seen rendering with realistic structure. Every word in it is
# deliberately, visibly filler.
#
# It is excluded from production builds two ways: `draft: true`, and the
# `_fixture-` filename prefix. `npm run validate:content` fails the build if a
# fixture ever reaches dist/.
#
# Delete this file once there is real writing on the site.
title: 'Fixture Essay A'
summary: 'Structural placeholder used to verify the long-form layout. Not real content.'
category: 'essay'
tags: []
publishedAt: 2024-01-15
updatedAt: 2024-02-02
draft: true
---

Body paragraph placeholder text. This paragraph exists to show the measure, the
leading and the colour of body type at a realistic length, so that the
long-form column can be judged before any real writing is placed into it. It
runs to several lines on a wide screen and rather more on a narrow one.

Body paragraph placeholder text with an [inline link](/writing/) so that link
colour and underline offset can be checked against surrounding type, plus
_emphasis_, **strong emphasis** and a footnote-ish aside.

## Section heading

Body paragraph placeholder text following a level-two heading. Headings in
long-form writing establish the vertical rhythm, so the spacing above and below
this one is worth looking at directly.

### Subsection heading

Body paragraph placeholder text following a level-three heading.

- List item placeholder
- List item placeholder
- List item placeholder, longer than the others so that wrapping behaviour
  inside a list can be seen

## Section heading

> Blockquote placeholder text. Pull quotes and cited passages both render
> through this element, so it needs to read well at a couple of lines.

Body paragraph placeholder text.

1. Ordered list item placeholder
2. Ordered list item placeholder
3. Ordered list item placeholder

### Code

```python
# Code block placeholder.
def placeholder(value: int) -> int:
    return value * 2
```

Inline `code span` placeholder within a sentence of body text.

## Section heading

| Column A | Column B | Column C |
| -------- | -------- | -------- |
| Cell     | Cell     | Cell     |
| Cell     | Cell     | Cell     |

Body paragraph placeholder text, final paragraph, to show the spacing between
the end of an article and whatever follows it.
