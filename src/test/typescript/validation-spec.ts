import { Validation, Success, Fail, IO } from '../../../index';

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

function getHttpError(code: number) {
    return Fail<number, string>(code);
}

const messageErrors: string = getHttpError(404).failMap<string>(String).failMap(Array)
    .ap(getHttpError(400).failMap(String).failMap(Array).map(v => t => v + t))
    .ap(getHttpError(500).failMap(String).failMap(Array).map(v => t => v + t))
    .cata(e => e.join(), v => v);

const messageCopy: string = Success<number[], string>('message: Yo man!')
    .ap(Success<number[], (v: string) => string[]>(m => m.split(': ')))
    .ap(Success<number[], (v: string[]) => string>(m => m.pop()))
    .cata(e => e.join(), v => v);

console.log(nameError, messageCopy, messageErrors);
