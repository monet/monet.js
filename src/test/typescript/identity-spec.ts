import { Identity } from '../../../index';

function getType(action) {
    return Identity(action.type);
}

function log(message: string): void {
    console.log(message);
}

const wrapped = Identity.unit({type: 'MESSAGE', payload: 'Hello World'});

const wrappedGreeting: Identity<string> = wrapped.bind(v => Identity.of(v.payload));

const wrappedType = wrapped.flatMap(getType);

const unpacked = wrappedGreeting.chain(g => wrappedType.map(t => `Type: ${t} - Body: ${g}`));

log(unpacked.get());
