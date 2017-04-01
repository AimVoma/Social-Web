import sys
from SPARQLWrapper import SPARQLWrapper, JSON, XML, N3, RDF
import nltk
import re
from nltk.corpus import stopwords


stop = set(stopwords.words('english'))
snow = nltk.stem.SnowballStemmer('english')

# TAKE UP TO 20 RESULTS FROM DPBEDIA SYNSETS
FIXED_SIZE = 20 ;

# QUERY DBPEDIA USING SPARQL-QUERY FOR SYNSETS OF THE PROVIDED STRING
def dbpedia(term):
    term = term.strip()
    nterm = term.capitalize().replace(' ','_')
    rterms = []
    rterms.append(term)


    query = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?label
    WHERE 
    { 
     {
     <http://dbpedia.org/resource/VALUE> <http://dbpedia.org/ontology/wikiPageRedirects> ?x.
     ?x rdfs:label ?label.
     }
     UNION
     { 
     <http://dbpedia.org/resource/VALUE> <http://dbpedia.org/ontology/wikiPageRedirects> ?y.
     ?x <http://dbpedia.org/ontology/wikiPageRedirects> ?y.
     ?x rdfs:label ?label.
     }UNION
     {
     ?x <http://dbpedia.org/ontology/wikiPageRedirects> <http://dbpedia.org/resource/VALUE>.
     ?x rdfs:label ?label.
     }
     UNION
     { 
     ?y <http://dbpedia.org/ontology/wikiPageRedirects> <http://dbpedia.org/resource/VALUE>.
     ?x <http://dbpedia.org/ontology/wikiPageRedirects> ?y.
     ?x rdfs:label ?label.
     }
     FILTER (lang(?label) = 'en')
    }
    """

    nquery = query.replace('VALUE',nterm)


    special_chars = set('/$.,()\{\}')
    regex = re.compile(r"", re.IGNORECASE)

    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery(nquery)


    sparql.setReturnFormat(JSON)
    try:
        ret = sparql.query()
        results = ret.convert()
        requestGood = True
    except Exception, e:
        results = str(e)
        requestGood = False
        
    if requestGood == False:
        return "Problem communicating with the server: ", results
    elif (len(results["results"]["bindings"]) == 0):
        return "No results found"
    else:
        for result in results["results"]["bindings"]:
            label = result["label"]["value"]
            print label
            rterms.append(label);

    # SANITIZE STRING RESULTS
    for index,rterm in enumerate(rterms):
        rterms[index] = snow.stem(rterms[index]);
        rterms[index] = rterms[index].encode('utf-8');
        rterms[index] = re.sub(r'(\s.*\..*\s)|(\(.*\))|(\w*\.)|(\.\w*)|\,','',rterms[index], 0 );
        rterms[index] = stop_words_removal(rterms[index]);

    # REMOVE DUPLICATES
    result = []
    for item in rterms:
        if item in result:
            pass
        else:
            result.append(item)

    # RE-STRUCTURE DATA
    if len(result) > FIXED_SIZE:
        result = result[0:FIXED_SIZE]
        alts = ','.join(result)
    else:
        alts = ','.join(result)
    
    #SEND SANITIZED-STRUCTURED RESULTS THROUGH STDO CHANNEL TO JAVASCRIPT
    print alts

def stop_words_removal(args):
    array_sentence = args.split(' ');
    temp_results = map(lambda non_stop: non_stop if non_stop not in stop else None, array_sentence)
    return ' '.join([x  for x in temp_results if x != None])
    
if __name__ == "__main__":
     dbpedia(sys.argv[1])    

