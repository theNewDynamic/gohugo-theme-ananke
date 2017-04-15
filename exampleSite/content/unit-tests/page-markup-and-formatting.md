---
title: Page Markup And Formatting
author: adamchlan
type: page
date: 2013-03-15T23:20:05+00:00
original_post_id:
  - "1083"

---
**Headings**

# Header one

## Header two

### Header three

#### Header four

##### Header five

###### Header six

## Blockquotes

Single line blockquote:

> Stay hungry. Stay foolish.

Multi line blockquote with a cite reference:

> People think focus means saying yes to the thing you&#8217;ve got to focus on. But that&#8217;s not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick carefully. I&#8217;m actually as proud of the things we haven&#8217;t done as the things I have done. Innovation is saying no to 1,000 things. <cite>Steve Jobs &#8211; Apple Worldwide Developers&#8217; Conference, 1997</cite>

## Tables

<table>
  <tr>
    <th>
      Employee
    </th>
    
    <th class="views">
      Salary
    </th>
    
    <th>
    </th>
  </tr>
  
  <tr class="odd">
    <td>
      <a href="http://example.com/">Jane</a>
    </td>
    
    <td>
      $1
    </td>
    
    <td>
      Because that&#8217;s all Steve Job&#8217; needed for a salary.
    </td>
  </tr>
  
  <tr class="even">
    <td>
      <a href="http://example.com">John</a>
    </td>
    
    <td>
      $100K
    </td>
    
    <td>
      For all the blogging he does.
    </td>
  </tr>
  
  <tr class="odd">
    <td>
      <a href="http://example.com/">Jane</a>
    </td>
    
    <td>
      $100M
    </td>
    
    <td>
      Pictures are worth a thousand words, right? So Tom x 1,000.
    </td>
  </tr>
  
  <tr class="even">
    <td>
      <a href="http://example.com/">Jane</a>
    </td>
    
    <td>
      $100B
    </td>
    
    <td>
      With hair like that?! Enough said&#8230;
    </td>
  </tr>
</table>

## Definition Lists

Definition List Title
:   Definition list division.

Startup
:   A startup company or startup is a company or temporary organization designed to search for a repeatable and scalable business model.

#dowork
:   Coined by Rob Dyrdek and his personal body guard Christopher &#8220;Big Black&#8221; Boykins, &#8220;Do Work&#8221; works as a self motivator, to motivating your friends.

Do It Live
:   I&#8217;ll let Bill O&#8217;Reilly will [explain][1] this one.

## Unordered Lists (Nested)

  * List item one 
      * List item one 
          * List item one
          * List item two
          * List item three
          * List item four
      * List item two
      * List item three
      * List item four
  * List item two
  * List item three
  * List item four

## Ordered List (Nested)

  1. List item one 
      1. List item one 
          1. List item one
          2. List item two
          3. List item three
          4. List item four
      2. List item two
      3. List item three
      4. List item four
  2. List item two
  3. List item three
  4. List item four

## HTML Tags

These supported tags come from the WordPress.com code [FAQ][2].

**Address Tag**

<address>
  1 Infinite Loop<br /> Cupertino, CA 95014<br /> United States
</address>

**Anchor Tag (aka. Link)**

This is an example of a [link][3].

**Abbreviation Tag**

The abbreviation srsly stands for &#8220;seriously&#8221;.

**Acronym Tag**

The acronym <acronym title="For The Win">ftw</acronym> stands for &#8220;for the win&#8221;.

**Big Tag**

These tests are a <big>big</big> deal, but this tag is no longer supported in HTML5.

**Cite Tag**

&#8220;Code is poetry.&#8221; &#8212;<cite>Automattic</cite>

**Code Tag**

You will learn later on in these tests that `word-wrap: break-word;` will be your best friend.

**Delete Tag**

This tag will let you <del>strikeout text</del>, but this tag is no longer supported in HTML5 (use the `<strike>` instead).

**Emphasize Tag**

The emphasize tag should _italicize_ text.

**Insert Tag**

This tag should denote <ins>inserted</ins> text.

**Keyboard Tag**

This scarcely known tag emulates <kbd>keyboard text</kbd>, which is usually styled like the `<code>` tag.

**Preformatted Tag**

This tag styles large blocks of code.

<pre>.post-title {
	margin: 0 0 5px;
	font-weight: bold;
	font-size: 38px;
	line-height: 1.2;
}</pre>

**Quote Tag**

<q>Developers, developers, developers&#8230;</q> &#8211;Steve Ballmer

**Strong Tag**

This tag shows **bold **text.****

**Subscript Tag**

Getting our science styling on with H<sub>2</sub>O, which should push the &#8220;2&#8221; down.

**Superscript Tag**

Still sticking with science and Isaac Newton&#8217;s E = MC<sup>2</sup>, which should lift the 2 up.

**Teletype Tag**

This rarely used tag emulates <tt>teletype text</tt>, which is usually styled like the `<code>` tag.

**Variable Tag**

This allows you to denote <var>variables</var>.

 [1]: https://www.youtube.com/watch?v=O_HyZ5aW76c "We'll Do It Live"
 [2]: http://en.support.wordpress.com/code/ "Code"
 [3]: http://apple.com "Apple"