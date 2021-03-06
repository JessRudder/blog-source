---
layout: post
title: "Teaching a Computer Ancient Greek"
author: JessRudder
date: 2014-07-08 18:13:51 -0400
categories: linguistics python ruby
images:
- images/@stock/post-3.jpg
excerpt:
  With the World Cup in full swing, I realize that's where most people's flag waving, nationalistic pride is focused.  But there's a different kind of nation vs nation drama about to unfold in Beijing, China.  It's the International Linguistics Olympiad of course!
---

TL;DR - It's really hard to teach a computer Ancient Greek.

With the World Cup in full swing, I realize that's where most people's flag waving, nationalistic pride is focused.  But there's a different kind of nation vs nation drama about to unfold in Beijing, China.  It's the [International Linguistics Olympiad](http://www.ioling.org) of course!

{% youtube https://www.youtube.com/embed/-Fu44oJqDjI %}

The International Linguistics Olympiad pits teams from around the world against each other to solve problems like the following:

{% img img-center /images/posts/linguistics-question.png 468px 381px "This is One of the Easy Problems!"" title:"Ancient Greek to English IOL Problem %}

With an entire holiday weekend stretching out before us, my husband and I decided to see if we could write a program that could solve problems like the one above.

My initial plan was to use brute force to break the phrases into progressively smaller chunks and use a nested hash to keep track of how frequently those chunks appear in each language (the assumption being if they appear roughly the same number of times, they must map to each other).

Having a degree in Linguistics (and perhaps a greater desire to not spend the entire weekend coding) my husband suggested we focus on sanitizing the data a bit (e.g. removing endings to find overlap in root words) and look for matching [n-grams](http://en.wikipedia.org/wiki/N-gram).  Frankly, an n-gram sounds like a fancy way of saying 'break the phrase into progressively smaller chunks and compare them' but it's a $10 word, so I'm going with it.

Our first step was to write some helper methods to take input sentences and turn them into nested lists of sentences broken into words broken into ngrams.

Example:  ( ('I am happy.' , 'You are happy!') )   =>   ( (('kno', 'now', 'know')) , (('you') , ('kno', 'now', 'know')) )

```python
def parse_words (sentence_list):
    # create a new list to store lists of sentences, broken into words
    word_list = []

    # chop up each sentence into a list of words using regex
    for s in sentence_list:
        # create a temporary tuple of words and a permanent list where filtered words will be stored
        temp_words = re.split ('\W+', s)
        words_in_s = []
        # take the temporary list of words and add each, uncapsed, to the permanent list
        for w in temp_words:
            # only add the word to the new permanent list if it's not empty ''
            if w != '':
                words_in_s.append(w.lower())
        # add the permanent list to the total word_list (the list of all sentences, broken into words)
        word_list.append(words_in_s)
        
    return word_list

def parse_ngrams (word_list, gram_length=3):
    
    # create a new list to store lists of sentences, broken into ngrams
    ngram_list = []

    # chop up each sentence into a list of ngrams of all reasonable lengths using NLTK.util ngrams (imported at top of this py)
    for s in word_list:
    # drill down into the sentences
        this_sentence = []
        for w in s:
        # drill down to the words in the sentence
            this_word = []
            for i in range (gram_length, len(w)):
            # break the word down into all ngrams between user's gram_length and the word's length                
                for j in ngrams(w,i):
                    # ngrams returns a tuple; make entries into strings
                    this_gram = ''
                    for char in j:
                        this_gram += char
                    # add each string into a list for each word
                    this_word.append(this_gram)
            # if the word's not empty, add this word into a list for each sentence
            if this_word != []:
                this_sentence.append(this_word)
        # add each sentence back into the total list
        ngram_list.append(this_sentence)

    return ngram_list
```

Next we wrote a function to deal with sanitizing and counting words in the English sentences.  It would take a list of English sentences broken into words, then determine the frequency count and location of each word within the list.  For anyone that cares, we're using a fuzzy definition of word closer to "lexical item".

Example:
english_sentences( (('I', 'am', 'not', 'happy') , ('You', 'are', 'very', 'very', 'happy')) )   =>     [['happy', [0, 1]], ['very', [1, 1]]]

```python
def english_sentences (word_list):
    word_dict = {}      # will be used to associate occurrences of words with when and where they occur in text

    # use the word list to go thru the example sentences, look for occurrences & put those occurrences in word_dict
    # grab each word from our list
    for sentence in word_list:
        for word in sentence:
            # NEW WORD FOUND: add dict entry for this frequency and index
            if word not in word_dict:
                word_dict[word] = [1, [word_list.index(sentence)] ]
            # ANOTHER INSTANCE FOUND: augment dict entry for this frequency and index
            elif word in word_dict:
                # increase the frequency count by 1
                word_dict[word][0] += 1
                # list the index of the sentence in which the word occurs
                word_dict[word][1].append(word_list.index(sentence))

            # FUZZY MATCH TEST: add the stem of words that contain common suffixes
            # 
            if len(word) > 3:
            # filter for longer words to avoid overmatching
                # check if the last letter is a suffix
                if word[len(word)-1:len(word)] in ('s', 'd'):
                    stem = word[:len(word)-1]
                    # increase count and index if it's already in the dict
                    if stem in word_dict:
                        word_dict[stem][0] += 1
                        word_dict[stem][1].append (word_list.index(sentence))
                    # add stem if it's not in dict
                    else:
                        word_dict[stem] = [1 , [word_list.index(sentence)] ]
                # check if the last two letters are a suffix
                if word[len(word)-2:len(word)] in ('es', 'ed', 'er'):
                    stem = word[:len(word)-2]
                    # check to see if last 2 chars of stem are geminate; if so, cut the stem shorter 
                    if stem[len(stem)-2] == stem[len(stem)-1]:
                        stem_short = stem[:len(stem)-1]
                        if stem_short in word_dict:
                            word_dict[stem_short][0] += 1
                            word_dict[stem_short][1].append (word_list.index(sentence))
                        # add stem if it's not in dict
                        else:
                            word_dict[stem_short] = [1 , [word_list.index(sentence)] ]
                    # increase count and index of the stem if it's already in the dict
                    if stem in word_dict:
                        word_dict[stem][0] += 1
                        word_dict[stem][1].append (word_list.index(sentence))
                    # add stem if it's not in dict
                    else:
                        word_dict[stem] = [1 , [word_list.index(sentence)] ]
                # check if the last three letters are a suffix
                elif word[len(word)-3:len(word)] in ('ing', 'ers', 'est'):
                    stem = word[:len(word)-3]
                    # check to see if last 2 chars of stem are geminate; if so, cut the stem shorter 
                    if stem[len(stem)-2] == stem[len(stem)-1]:
                        stem_short = stem[:len(stem)-1]
                        if stem_short in word_dict:
                            word_dict[stem_short][0] += 1
                            word_dict[stem_short][1].append (word_list.index(sentence))
                        # add stem if it's not in dict
                        else:
                            word_dict[stem_short] = [1 , [word_list.index(sentence)] ]
                    # increase count and index of the stem if it's already in the dict
                    if stem in word_dict:
                        word_dict[stem][0] += 1
                        word_dict[stem][1].append (word_list.index(sentence))
                    # add stem if it's not in dict
                    else:
                        word_dict[stem] = [1 , [word_list.index(sentence)] ]
                else:
                    pass
            
    # create a list in which all found words and locations will be stored
    example_map = []
    # add to list only words that occur more than once, along with their locations
    for k in word_dict:
        # get rid of common little words for easier comparison
        if k not in ('the', 'a', 'an', 'if', 'for', 'of', 'to', 'at'):
            if word_dict[k][0] > 1:
                example = [k , word_dict[k][1] ]
                example_map.append(example)

    # return only the numbers in the example map, unweighted by frequency occurrence
    return_vals = []
    for i in range (0, len(example_map) ):
    # iterate through results, dig out only occurrence locations, put them in new list with no dups
        if example_map[i][1] not in return_vals:
            return_vals.append(example_map[i][1])
            
    return return_vals
```

Next we needed to deal with the list of unknown sentences. We iterate through the sentence and determine if any of their grams show up more than once. Our output is a list of all the examples of multiple matches, including which sentences they occur in.

Example:
  puzzle_sentences( (('zzxzzz gyyyggr') , ('zzz yyyyxyg')) )   =>     [['zzz', [0, 1]], ['yyyy', [0, 1]]]

```python
def puzzle_sentences (word_list):
    
    word_dict = {}      # will be used to associate occurrences of words with when and where they occur in text

    # use the word list to go thru the example sentences, look for occurrences & put those occurrences in word_dict
    # grab each word from our list
    for sentence in word_list:
        for word in sentence:
            for gram in word:
            
                # NEW MATCH FOUND: add dict entry for this frequency and index
                if gram not in word_dict:
                    word_dict[gram] = [1, [word_list.index(sentence)] ]
            
                # ANOTHER INSTANCE FOUND: augment dict entry for this frequency and index
                elif gram in word_dict:
                    # increase the frequency count by 1
                    word_dict[gram][0] += 1
                    # list the index of the sentence in which the word occurs
                    word_dict[gram][1].append(word_list.index(sentence))

    # create a list in which all matched ngrams will be stored
    example_map = []
    # add to list only ngrams that occur more than once, along with locations
    for k in word_dict:
        if word_dict[k][0] > 1:
            example = [k , word_dict[k][1] ]
            example_map.append(example)

    # return only the numbers in the example map, unweighted by frequency occurrence
    return_vals = []
    for i in range (0, len(example_map) ):
    # iterate through results, dig out only occurrence locations, put them in new list with no dups
        if example_map[i][1] not in return_vals:
            return_vals.append(example_map[i][1])

    return return_vals
```

Then we took the list of lists of occurence locations and searched it for degree-of-separation patterns.

e.g. traversing [[0,1,3],[0,2,4]], looking at the key 1:

                          1            1
                         / \          / \
                        0   3        Y   Y
                       / \          / \
                      2   4        N  N

yields the entry    1: [[Y,Y],[N,N]]

```python
def deg_separ_matcher (loc_list):

    pattern_dict = {}

    # create a basic dictionary associating each num with other nums that occur in same list at any point
    for locations in loc_list:
    # drill into list of nums
        for loc in locations:
        # drill down to nums themselves
            # create a list of locations that cooccur with loc
            if loc not in pattern_dict:
            # new dictionary entry if num isn't already a key
                pattern_dict[loc] = []
            for loc2 in locations:
            # add nums that aren't already in that value and that aren't identical to the key (keys always occur with themselves in a list!)
                if loc2 != loc and loc2 not in pattern_dict[loc]:
                    pattern_dict[loc].append (loc2)

    # take pattern dictionary above and branch patterns based on degree of separation of cooccurrences
    solutions_dict = {}
    for loc in pattern_dict:
        lvl_1 = []
        lvl_2 = []
        lvl_3 = []
        # dig into the first branch. All these cooccur with loc, so pass Y for each
        for coloc in pattern_dict[loc]:
            lvl_1.append('Y')
            lvl_1.append(coloc)
            #dig into the 2nd branch. Check if the number in question occurs within the coloc's list
            for sub_coloc in pattern_dict[coloc]:
                # is the original num in the list of nums that occur (sub_colocs) with the nums that occur (colocs) with the original num?
                if loc in pattern_dict[sub_coloc] and sub_coloc not in lvl_1:
                    lvl_2.append('Y')
                    lvl_2.append(sub_coloc)
                elif loc not in pattern_dict[sub_coloc] and sub_coloc not in lvl_1:
                    lvl_2.append('N')
                    lvl_2.append(sub_coloc)
                else:
                    pass
                #dig into the 3rd branch. Check if the number in question occurs within the sub_coloc's list
                for sub_sub_coloc in pattern_dict[sub_coloc]:
                # is the original num in the list of nums that occur (sub_sub_colocs) with the numbs that cooccur (sub_colocs) with the nums that cooccur (colocs) with the original num?                    
                    if loc in pattern_dict[sub_sub_coloc] and sub_sub_coloc not in lvl_2:
                        lvl_3.append('Y')
                        lvl_3.append('N')
                    elif loc not in pattern_dict[sub_sub_coloc] and sub_sub_coloc not in lvl_2:
                    else:
                        pass
        # add loc's first list to total list
        total = [lvl_1, lvl_2, lvl_3]
        solutions_dict[loc] = total
        
    return solutions_dict
```

Finally, we wrote a function that compared the 2 dictionaries to determine which keys have the same values, and pair those keys.

```python

def dict_compar (d1, d2):
    matches = []
    for k1, v1 in d1.iteritems():
        for k2, v2 in d2.iteritems():
            if v1[0].count('Y') == v2[0].count('Y') and v1[0].count('N') == v2[0].count('N'):
                if v1[1].count('Y') == v2[1].count('Y') and v1[1].count('N') == v2[1].count('N'):
                    if v1[2].count('Y') == v2[2].count('Y') and v1[2].count('N') == v2[2].count('N'):
                        matches.append ([k1, k2])
    return matches
```

In the end, we were able to get it to identify 2 out of 8 matches correctly.  Not exactly a passing grade.  

At this point I decided to take an entirely different approach and look for a Ruby gem that works with Google Translate.  This gem totally exists, but, you have to get your own API key from Google and that's not free.

There is no way I was shelling out my precious pizza money for that token when I can make the same queries via the web and scrape the data.  I was gearing up to work on the scraper when it occurred to me that I should check to see if the data that I would get from Google Translate would work for my purposes.

That's when I discovered Google Translate doesn't have an Ancient Greek option.  Apparently the folks at Google are too self absorbed to anticipate that I might one day need to do a random translation of Ancient Greek so it never got built into their free web app.  The nerve!
So, for now, the participants in the International Linguistics Olympiad can breath easy.  They won't be replaced by a computer....yet!
