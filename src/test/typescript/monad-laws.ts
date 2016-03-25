import { Identity, Some, None } from 'monet';

function idOperation(x: number) {
    return Identity(x + 2)
}

console.log(Identity(2).flatMap(idOperation).get() === idOperation(2).get());
console.log(Identity(2).flatMap(Identity).get() === Identity(2).get());
console.log(Identity(2).flatMap(idOperation).flatMap(idOperation).get() ===
    Identity(2).flatMap(v => idOperation(v).flatMap(idOperation)).get());

function maybeOperation(x: number) {
    return Maybe.fromNull(x + 2);
}

console.log(Some(2).flatMap(maybeOperation).some() === maybeOperation(2).some());
console.log(Some(2).flatMap(Some).some() === Some(2).some());
console.log(Some(2).flatMap(maybeOperation).flatMap(maybeOperation).some() ===
    Some(2).flatMap(v => maybeOperation(v).flatMap(maybeOperation)).some());

console.log(None().flatMap(maybeOperation).isNone() === maybeOperation(2).isNone());
console.log(None().flatMap(None).isNone() === None().isNone());
console.log(None().flatMap(maybeOperation).flatMap(maybeOperation).isNone() ===
    None<number>().flatMap(v => maybeOperation(v).flatMap(maybeOperation)).isNone());
