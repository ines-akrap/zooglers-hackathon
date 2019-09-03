// Find person with the highest salience in the paragraph
const getPerson = (entities) => {
    const persons = entities.filter((entity) => {
        return entity.type === 'PERSON';
    });

    console.log(persons);

    return persons.reduce((prev, current) => {
        return (prev.salience > current.salience) ? prev : current
    });
}

module.exports = {getPerson}