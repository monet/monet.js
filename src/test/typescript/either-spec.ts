import { Either, Right, Left, IO } from 'monet';

console.assert(Either.Left('ERR') === Left('ERR'));
console.assert(Either.Right('a') === Right('a'));
console.assert(!(Right<string, string>('A') === Left<string, string>('ERR')));

function getType(action) {
    return action.type === 'MESSAGE' ? Right<string, string>(action.type) : Left<string, string>('BadType');
}

function log(message: Either<string, string>) {
    return message.cata(err => IO(() => {
        console.error(err);
    }), msg => IO(() => {
        console.log(msg);
    }));
}

function log2(message: Either<string, string>): IO<void> {
    return message.bimap(err => IO(() => {
        console.error(err);
    }), msg => IO(() => {
        console.log(msg);
    })).cata(e => e, m => m);
}

function log3(message: Either<string, string>): void {
    if (message.isRight()) {
        console.log(message.right());
    } else if (message.isLeft()) {
        console.warn(message.left());
    }
}

interface IMessage {
    type: string;
    payload: string;
}

function getMessage(msg: IMessage) {
    if (msg && msg.hasOwnProperty('type')) {
        return Right<string, IMessage>(msg);
    }
    return Left<string, IMessage>('BadMessageFormat.');
}

const wrapped = getMessage({type: 'MESSAGE', payload: 'Hello World'});

console.assert(!(wrapped.isRight() === wrapped.isLeft()));

const wrappedGreeting: Either<string, string> = wrapped.bind(v => v.payload ?
    Right<string, string>(v.payload) :
    Left<string, string>('NonePayload'));

const wrappedType = wrapped.flatMap(getType);

const unpacked = wrappedGreeting.chain(g => wrappedType.map(t => `Type: ${t} - Body: ${g}`));

log(unpacked).run();
log2(getMessage(null).flatMap(getType)).performUnsafeIO();
log3(getMessage({type: 'x', payload: null}).chain(getType));

const nameError: string = Left('-- Adamovisch').leftMap(n => n.split(' ').shift()).left();

console.log(nameError);