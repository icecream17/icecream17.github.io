## A WikiRace strat

### Rules

1. Start on an article
2. If an article is a redirect start where the article redirects
3. Click on the first wikilink as represented by the source code that is not a page you've visited before.
  a. If there are no links - you've finished! Improve that page or an earlier page in your list to prevent anyone from finishing.
4. Your new starting point is that article - add that article to some list and go back to step 1.

The only restriction on wikilinks is that they're non-external. In the source code means surrounded by 2 opening and closing square brackets.  
If they don't show up as links they're not links. Like with noscript tags. Or [[File: text]]

### The first article

Let's start on the first article
https://en.wikipedia.org/w/index.php?title=Special:AllPages&from=%20

Redirects to: The article redirects to a page.
Shown as: The article was shown under a different name, e.g.: ```[[Bits#1|Positive]]```  
Skipped: Skipped some links that were already visited:  
```  <article> or <number> or "A lot" ```  
!! time-sensitive !! Link has a 100% chance of changing over time. All articles naturally change anyways however.

``` md
1. !
  a. Redirects to: Exclamation mark
2. Inverted question and exclamation marks
  a. Shown as: Inverted exclamation mark
3. ¿Por qué no te callas?
4. Juan Carlos I
  a. Link text was: King Juan Carlos I
5. King of Spain
6. Felipe VI
  a. !! time-sensitive !!
7. List of titles and honours of the Spanish Crown
  a. Shown as: more...
8. Coat of Arms of the King of Spain
  a. Shown as: Coat of Arms of the Spanish Crown
  
```
