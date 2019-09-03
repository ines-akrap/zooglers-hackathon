// Find person with the highest salience in the paragraph
const getPerson = (entities) => {
    const persons = entities.filter((entity) => {
        return entity.type === 'PERSON';
    });

    return persons.reduce((prev, current) => {
        return (prev.salience > current.salience) ? prev : current
    });
}

const findPerson = (person, syntax) => {
    const personWord = syntax.tokens.find((part) => {
        console.log(`${part.partOfSpeech.tag}: ${part.text.content}`);
        console.log(`Morphology:`, part.partOfSpeech);
        return part.lemma === person;
    });
    return personWord;
}

const findNouns = (syntax) => {
    const adjectives = syntax.tokens.filter((part) => {
        return part.partOfSpeech.tag === 'ADJ';
    });

    const properties = [];
    adjectives.forEach((adj) => {
        const nounIndex = adj.dependencyEdge.headTokenIndex;
        const noun = syntax.tokens[nounIndex].text.content;
        properties.push(`${adj.text.content} ${noun}`);
    });
    return properties;
}

const makeQuery = (parameters) => {
    let query = '';
    for (let i=0; i<parameters.length; i++) {
        const words = parameters[i].split(' ');
        query = `${query}${words[0]}+${words[1]}+`
    }
    return query;
}

const getImageUrl = (parameters) => {
    console.log(parameters);
    const urlPrefix = 'https://www.googleapis.com/customsearch/v1';
    const cx = '012935963864218845585:ljfi5ok9qfq';
    const key = 'AIzaSyC_6tNo48blpmtZN1KFL2hWXlIwwpBoxQU';
    const number = '1';
    const imgSize = 'large';
    const searchType = 'image';
    const query = makeQuery(parameters);

    return `${urlPrefix}?q=${query}&cx=${cx}&key=${key}&num=${number}&imgSize=${imgSize}&searchType=${searchType}`;
}

module.exports = {
    getPerson,
    findPerson, 
    findNouns,
    getImageUrl
}