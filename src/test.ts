const Foo = ({ firstName, lastName }) => {
    return null;
}

function Bar () {}

const Baz = Bar;

Foo.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string
}
Foo.displayName = '';