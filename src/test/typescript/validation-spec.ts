import { Validation, Success, Fail, IO } from 'monet';

console.assert(Validation.fail('ERR') === Fail('ERR'));
console.assert(Validation.success('a') === Success('a'));
console.assert(!(Success<string, string>('A') === Fail<string, string>('ERR')));

function getType(action) {
    return action.type === 'MESSAGE' ? Success<string, string>(action.type) : Fail<string, string>('BadType');
}

function log(message: Validation<string, string>) {
    return message.cata(err => IO(() => {
        console.error(err);
    }), msg => IO(() => {
        console.log(msg);
    }));
}

function log2(message: Validation<string, string>): IO<void> {
    return message.bimap(err => IO(() => {
        console.error(err);
    }), msg => IO(() => {
        console.log(msg);
    })).cata(e => e, m => m);
}

function log3(message: Validation<string, string>): void {
    if (message.isSuccess()) {
        console.log(message.success());
    } else if (message.isFail()) {
        console.warn(message.fail());
    }
}

interface IMessage {
    type: string;
    payload: string;
}

function getMessage(msg: IMessage) {
    if (msg && msg.hasOwnProperty('type')) {
        return Success<string, IMessage>(msg);
    }
    return Fail<string, IMessage>('BadMessageFormat.');
}

const wrapped = getMessage({type: 'MESSAGE', payload: 'Hello World'});

console.assert(!(wrapped.isSuccess() === wrapped.isFail()));

const wrappedGreeting: Validation<string, string> = wrapped.bind(v => v.payload ?
    Validation.success<string, string>(v.payload) :
    Validation.fail<string, string>('NonePayload'));

const wrappedType = wrapped.flatMap(getType);

const unpacked = wrappedGreeting.chain(g => wrappedType.map(t => `Type: ${t} - Body: ${g}`));

log(unpacked).run();
log2(getMessage(null).flatMap(getType)).performUnsafeIO();
log3(getMessage({type: 'x', payload: null}).chain(getType));

const nameError: string = Fail('-- Adamovisch').failMap(n => n.split(' ').shift()).fail();

console.log(nameError);
