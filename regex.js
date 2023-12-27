/**
 * ! Regular Expressions
Regular expressions is a powerful way of doing search and replace in strings.

Patterns and flags
Character classes
Unicode: flag "u" and class \p{...}
Anchors: string start ^ and end $
Multiline mode of anchors ^ $, flag "m"
Word boundary: \b
Escaping, special characters
Sets and ranges [...]
Quantifiers +, *, ? and {n}
Greedy and lazy quantifiers
Capturing groups
Backreferences in pattern: \N and \k<name>
Alternation (OR) |
Lookahead and lookbehind
Catastrophic backtracking
Sticky flag "y", searching at position
Methods of RegExp and String

**/

/**
 * ! Patterns and flags
 * regexp = new RegExp("pattern", "flags")
 * regexp = /pattern/
 * regexp = /pattern/gmi
 * 
 * Slashes /.../ tell JavaScript that we are creating a regular expression. They play the same role as quotes for strings.

In both cases regexp becomes an instance of the built-in RegExp class.

The main difference between these two syntaxes is that pattern using slashes /.../ does not allow for expressions to be inserted (like string template literals with ${...}). They are fully static.

Slashes are used when we know the regular expression at the code writing time – and that’s the most common situation. While new RegExp is more often used when we need to create a regexp “on the fly” from a dynamically generated string.

Flags
Regular expressions may have flags that affect the search.

There are only 6 of them in JavaScript:

i
With this flag the search is case-insensitive: no difference between A and a (see the example below).
g
With this flag the search looks for all matches, without it – only the first match is returned.
m
Multiline mode (covered in the chapter Multiline mode of anchors ^ $, flag "m").
s
Enables “dotall” mode, that allows a dot . to match newline character \n (covered in the chapter Character classes).
u
Enables full Unicode support. The flag enables correct processing of surrogate pairs. More about that in the chapter Unicode: flag "u" and class \p{...}.
y
“Sticky” mode: searching at the exact position in the text (covered in the chapter Sticky flag "y", searching at position)

Searching: str.match
As mentioned previously, regular expressions are integrated with string methods.

The method str.match(regexp) finds all matches of regexp in the string str.

It has 3 working modes:

If the regular expression has flag g, it returns an array of all matches:

let str = "We will, we will rock you";

alert( str.match(/we/gi) ); // We,we (an array of 2 substrings that match)
Please note that both We and we are found, because flag i makes the regular expression case-insensitive.

If there’s no such flag it returns only the first match in the form of an array, with the full match at index 0 and some additional details in properties:

let str = "We will, we will rock you";

let result = str.match(/we/i); // without flag g

alert( result[0] );     // We (1st match)
alert( result.length ); // 1

// Details:
alert( result.index );  // 0 (position of the match)
alert( result.input );  // We will, we will rock you (source string)
The array may have other indexes, besides 0 if a part of the regular expression is enclosed in parentheses. We’ll cover that in the chapter Capturing groups.

And, finally, if there are no matches, null is returned (doesn’t matter if there’s flag g or not).

This a very important nuance. If there are no matches, we don’t receive an empty array, but instead receive null. Forgetting about that may lead to errors, e.g.:

let matches = "JavaScript".match(/HTML/); // = null

if (!matches.length) { // Error: Cannot read property 'length' of null
  alert("Error in the line above");
}
If we’d like the result to always be an array, we can write it this way:

let matches = "JavaScript".match(/HTML/) || [];

if (!matches.length) {
  alert("No matches"); // now it works
}
Replacing: str.replace
The method str.replace(regexp, replacement) replaces matches found using regexp in string str with replacement (all matches if there’s flag g, otherwise, only the first one).

For instance:

// no flag g
alert( "We will, we will".replace(/we/i, "I") ); // I will, we will

// with flag g
alert( "We will, we will".replace(/we/ig, "I") ); // I will, I will
The second argument is the replacement string. We can use special character combinations in it to insert fragments of the match:

Symbols	Action in the replacement string
$&	inserts the whole match
$`	inserts a part of the string before the match
$'	inserts a part of the string after the match
$n	if n is a 1-2 digit number, then it inserts the contents of n-th parentheses, more about it in the chapter Capturing groups
$<name>	inserts the contents of the parentheses with the given name, more about it in the chapter Capturing groups
$$	inserts character $
An example with $&:

alert( "I love HTML".replace(/HTML/, "$& and JavaScript") ); // I love HTML and JavaScript
Testing: regexp.test
The method regexp.test(str) looks for at least one match, if found, returns true, otherwise false.

let str = "I love JavaScript";
let regexp = /LOVE/i;

alert( regexp.test(str) ); // true
Later in this chapter we’ll study more regular expressions, walk through more examples, and also meet other methods.

Summary
A regular expression consists of a pattern and optional flags: g, i, m, u, s, y.
Without flags and special symbols (that we’ll study later), the search by a regexp is the same as a substring search.
The method str.match(regexp) looks for matches: all of them if there’s g flag, otherwise, only the first one.
The method str.replace(regexp, replacement) replaces matches found using regexp with replacement: all of them if there’s g flag, otherwise only the first one.
The method regexp.test(str) returns true if there’s at least one match, otherwise, it returns false.

**/

/**
 * ! Character Classes
 * 
Consider a practical task – we have a phone number like "+7(903)-123-45-67", and we need to turn it into pure numbers: 79031234567.

To do so, we can find and remove anything that’s not a number. Character classes can help with that.

A character class is a special notation that matches any symbol from a certain set.

For the start, let’s explore the “digit” class. It’s written as \d and corresponds to “any single digit”.

For instance, let’s find the first digit in the phone number:

let str = "+7(903)-123-45-67";

let regexp = /\d/;

alert( str.match(regexp) ); // 7
Without the flag g, the regular expression only looks for the first match, that is the first digit \d.

Let’s add the g flag to find all digits:

let str = "+7(903)-123-45-67";

let regexp = /\d/g;

alert( str.match(regexp) ); // array of matches: 7,9,0,3,1,2,3,4,5,6,7

// let's make the digits-only phone number of them:
alert( str.match(regexp).join('') ); // 79031234567
That was a character class for digits. There are other character classes as well.

Most used are:

\d (“d” is from “digit”)
A digit: a character from 0 to 9.
\s (“s” is from “space”)
A space symbol: includes spaces, tabs \t, newlines \n and few other rare characters, such as \v, \f and \r.
\w (“w” is from “word”)
A “wordly” character: either a letter of Latin alphabet or a digit or an underscore _. Non-Latin letters (like cyrillic or hindi) do not belong to \w.
For instance, \d\s\w means a “digit” followed by a “space character” followed by a “wordly character”, such as 1 a.

A regexp may contain both regular symbols and character classes.

For instance, CSS\d matches a string CSS with a digit after it:

let str = "Is there CSS4?";
let regexp = /CSS\d/

alert( str.match(regexp) ); // CSS4
Also we can use many character classes:

alert( "I love HTML5!".match(/\s\w\w\w\w\d/) ); // ' HTML5'
The match (each regexp character class has the corresponding result character):


Inverse classes
For every character class there exists an “inverse class”, denoted with the same letter, but uppercased.

The “inverse” means that it matches all other characters, for instance:

\D
Non-digit: any character except \d, for instance a letter.
\S
Non-space: any character except \s, for instance a letter.
\W
Non-wordly character: anything but \w, e.g a non-latin letter or a space.
In the beginning of the chapter we saw how to make a number-only phone number from a string like +7(903)-123-45-67: find all digits and join them.

let str = "+7(903)-123-45-67";

alert( str.match(/\d/g).join('') ); // 79031234567
An alternative, shorter way is to find non-digits \D and remove them from the string:

let str = "+7(903)-123-45-67";

alert( str.replace(/\D/g, "") ); // 79031234567
A dot is “any character”
A dot . is a special character class that matches “any character except a newline”.

For instance:

alert( "Z".match(/./) ); // Z
Or in the middle of a regexp:

let regexp = /CS.4/;

alert( "CSS4".match(regexp) ); // CSS4
alert( "CS-4".match(regexp) ); // CS-4
alert( "CS 4".match(regexp) ); // CS 4 (space is also a character)
Please note that a dot means “any character”, but not the “absence of a character”. There must be a character to match it:

alert( "CS4".match(/CS.4/) ); // null, no match because there's no character for the dot
Dot as literally any character with “s” flag
By default, a dot doesn’t match the newline character \n.

For instance, the regexp A.B matches A, and then B with any character between them, except a newline \n:

alert( "A\nB".match(/A.B/) ); // null (no match)
There are many situations when we’d like a dot to mean literally “any character”, newline included.

That’s what flag s does. If a regexp has it, then a dot . matches literally any character:

alert( "A\nB".match(/A.B/s) ); // A\nB (match!)
Not supported in IE
The s flag is not supported in IE.

Luckily, there’s an alternative, that works everywhere. We can use a regexp like [\s\S] to match “any character” (this pattern will be covered in the article Sets and ranges [...]).

alert( "A\nB".match(/A[\s\S]B/) ); // A\nB (match!)
The pattern [\s\S] literally says: “a space character OR not a space character”. In other words, “anything”. We could use another pair of complementary classes, such as [\d\D], that doesn’t matter. Or even the [^] – as it means match any character except nothing.

Also we can use this trick if we want both kind of “dots” in the same pattern: the actual dot . behaving the regular way (“not including a newline”), and also a way to match “any character” with [\s\S] or alike.

Pay attention to spaces
Usually we pay little attention to spaces. For us strings 1-5 and 1 - 5 are nearly identical.

But if a regexp doesn’t take spaces into account, it may fail to work.

Let’s try to find digits separated by a hyphen:

alert( "1 - 5".match(/\d-\d/) ); // null, no match!
Let’s fix it adding spaces into the regexp \d - \d:

alert( "1 - 5".match(/\d - \d/) ); // 1 - 5, now it works
// or we can use \s class:
alert( "1 - 5".match(/\d\s-\s\d/) ); // 1 - 5, also works
A space is a character. Equal in importance with any other character.

We can’t add or remove spaces from a regular expression and expect it to work the same.

In other words, in a regular expression all characters matter, spaces too.

Summary
There exist following character classes:

\d – digits.
\D – non-digits.
\s – space symbols, tabs, newlines.
\S – all but \s.
\w – Latin letters, digits, underscore '_'.
\W – all but \w.
. – any character if with the regexp 's' flag, otherwise any except a newline \n.
…But that’s not all!

Unicode encoding, used by JavaScript for strings, provides many properties for characters, like: which language the letter belongs to (if it’s a letter), is it a punctuation sign, etc.

We can search by these properties as well. That requires flag u, covered in the next article.
**/