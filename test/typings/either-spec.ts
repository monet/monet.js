import { Either, Right, Left, IO } from '../../src/monet';

function getType(action: { type: string }) {
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
    payload: string|null;
}

function getMessage(msg: IMessage|null) {
    if (msg && msg.hasOwnProperty('type')) {
        return Right<string, IMessage>(msg);
    }
    return Left<string, IMessage>('BadMessageFormat.');
}

const message: IMessage = {type: 'MESSAGE', payload: 'Hello World'};
const wrapped = getMessage(message);

console.assert(!(wrapped.isRight() === wrapped.isLeft()));
console.assert(wrapped.equals(Right<string, IMessage>(message)));

const wrappedGreeting: Either<string, string> = wrapped.bind(v => v.payload ?
    Right<string, string>(v.payload) :
    Left<string, string>('NonePayload'));

const wrappedType = wrapped.flatMap(getType);

const unpacked = wrappedGreeting.chain(g => wrappedType.map(t => `Type: ${t} - Body: ${g}`));

log(unpacked).run();
log2(getMessage(null).flatMap(getType)).performUnsafeIO();
log3(getMessage({type: 'x', payload: null}).chain(getType));

const nameError: string = Left('-- Adamovisch').leftMap((n:string) => n.split(' ').shift() || "").left();

const messageCopy: string = Left<number, string>(404)
    .leftMap(String)
    .ap(unpacked.map(m => (p: string) => p + ' ' + m))
    .cata(e => e, v => v);

const contains: boolean = wrappedGreeting.contains("test");
Right<number, string>("hello").forEach((str:string) => console.log(str));
Left<string, number>("none").forEachLeft((str:string) => console.log("oops"));

const twelve: Either<string, number> = Either.right<string,number>(12);
const oops: Either<string, number> = Either.left<string,number>("oops");

console.assert(twelve.right() === 12);
console.assert(oops.left() === "oops");

console.log(nameError, messageCopy);
