import { Maybe, Some, None, Just, Nothing, IO } from '../../../index';

function getType(action) {
    return Maybe.fromNull(action.type).filter(t => t !== 'MESSAGE');
}

function log(message: Maybe<string>): IO<void> {
    return message.cata(() => IO(() => {
        console.warn('Nothing to log.')
    }), msg => IO(() => {
        console.log(msg);
    }));
}

function log2(message: Maybe<string>): IO<void> {
    return message.fold(IO(() => {
        console.warn('Nothing to log.')
    }))(msg => IO(() => {
        console.log(msg);
    }));
}

function log3(message: Maybe<string>): void {
    if (message.isJust()) {
        console.log(message.just())
    } else {
        console.warn('Nothing to log.')
    }
}

function log3b(message: Maybe<string>): void {
    if (message.isSome()) {
        console.log(message.some())
    } else {
        console.warn('Nothing to log.')
    }
}

interface IMessage {
    type: string;
    payload: string;
}

function getMessage(msg: IMessage): Maybe<IMessage> {
    if (msg && msg.hasOwnProperty('type')) {
        return Just(msg);
    }
    return None<IMessage>();
}

const wrapped = getMessage({type: 'MESSAGE', payload: 'Hello World'});

console.assert(wrapped.isSome() === wrapped.isJust());
console.assert(wrapped.isNone() === wrapped.isNothing());
console.assert(!(wrapped.isNone() === wrapped.isJust()));

const wrappedGreeting: Maybe<string> = wrapped.bind(v => Maybe.fromNull(v.payload));

const wrappedType = wrapped.flatMap(getType);

const unpacked = wrappedGreeting.chain(g => wrappedType.map(t => `Type: ${t} - Body: ${g}`));

log(unpacked).run();
log2(getMessage(null).flatMap(getType)).performUnsafeIO();
log3(Some('Message!'));
log3b(getMessage({type: 'x', payload: null}).chain(getType));

const name: string = None<string>().orSome('NAME');
const surname: string = Nothing<string>().orJust('SURNAME');
const message: string = Maybe.Just(0).filter(Boolean).map(String).orElse(unpacked).orJust('Hi!');
const messageCopy: string = Nothing().ap(unpacked.map(m => () => m)).orSome('Hi!');

console.log(name, surname, message, messageCopy);
