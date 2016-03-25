import { Identity } from 'monet';

function getType(action) {
    return Identity(action.type);
}

function log(message: string): void {
    console.log(message);
}

const wrapped = Identity({type: 'MESSAGE', payload: 'Hello World'});

const wrappedGreeting: Identity<string> = wrapped.map(v => v.payload);

const wrappedType = wrapped.flatMap(getType);

const unpacked = wrappedGreeting.flatMap(g => wrappedType.map(t => `Type: ${t} - Body: ${g}`));

log(unpacked.get());
