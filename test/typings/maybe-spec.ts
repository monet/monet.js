import { Maybe, Some, None, Just, Nothing, IO } from '../../src/monet';

function getType(action: { type: string }) {
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
    payload: string|null;
}

function getMessage(msg: IMessage|null): Maybe<IMessage> {
    if (msg && msg.hasOwnProperty('type')) {
        return Just(msg);
    }
    return None<IMessage>();
}
const msg: IMessage = {type: 'MESSAGE', payload: 'Hello World'};
const wrapped = getMessage(msg);

console.assert(wrapped.isSome() === wrapped.isJust());
console.assert(wrapped.isNone() === wrapped.isNothing());
console.assert(!(wrapped.isNone() === wrapped.isJust()));
console.assert(wrapped.equals(Some(msg)));

const wrappedGreeting: Maybe<string> = wrapped.bind(v => Maybe.fromNull(v.payload));

const wrappedType = wrapped.flatMap(getType);

const unpacked = wrappedGreeting.chain(g => wrappedType.map(t => `Type: ${t} - Body: ${g}`));

log(unpacked).run();
log2(getMessage(null).flatMap(getType)).performUnsafeIO();
log3(Some('Message!'));
log3b(getMessage({type: 'x', payload: null}).chain(getType));

const name: string = None<string>().orSome('NAME');
const surname: string = Nothing<string>().orJust('SURNAME');
const message: string = Maybe.Just(0).filter(Boolean).map<string>(String).orElse(unpacked).orJust('Hi!');
const messageCopy: string = Maybe.Nothing().ap(unpacked.map(m => () => m)).orSome('Hi!');
Maybe.Just("hello").orNoneIf(false).forEach((str:string) => console.log(str));
None<string>().orNothingIf(true).orElseRun(() => console.log("oops"));

const plus18 = (val: number) => val + 18;

interface Foo {
    bar: string
}

console.assert(Maybe.some(12).map(plus18).some() == 30);
console.assert(Maybe.some(12).map<number>(plus18).some() == 30);
console.assert(Maybe.some("hi").map<string>(String).some() == "hi");
console.assert(Maybe.some([1,2]).map<number[]>(l => l).some() == [1,2]);
console.assert(Maybe.some({bar: "foobar"}).map<{[k: string]: string}>(l => l).some() == {bar: "foobar"});
console.assert(Maybe.some({bar: "foobar"}).map<Foo>(l => l).some() == {bar: "foobar"});
console.assert(Maybe.none<number>().map(plus18).isNone());
console.assert(Maybe.none<number>().map<number>(plus18).isNone());
console.assert(Some(11).map(plus18).isNone());
console.assert(Maybe.of('a').flatMap(a => Some(a + 'b')).orNull() === null);
console.assert(Maybe.of('a').filter(Boolean).orJust('b') === null);
console.log(name, surname, message, messageCopy);

// Remove comment to test NonNullable return type by forcing the type check to fail
/*
console.assert(Maybe.some(12).map(n => {}).isSome());
console.assert(Maybe.some(12).map(n => null).isSome());
console.assert(Maybe.some(12).map(n => undefined).isSome());
console.assert(Maybe.some(12).map(n => { n++; }).isSome());
*/