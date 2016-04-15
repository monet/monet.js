import {List, Nil, Maybe, Some, Either, Right, Validation, Success, IO, Reader, None} from '../../../index';

const x: List<List<string>> = List.fromArray(['1', '2', '3']).map(Number)
    .takeLeft(List.of(true, Nil))
    .takeRight(List.unit(['a', 'b', 'c']))
    .map(List.fromArray);
const y: List<List<string>> = x.join<string>()
    .flatMap(s => List.pure(`Value: ${s}`).cons(s))
    .tails();
const z: List<string> = y.flatten<string>()
    .reverse().snoc('Ehh…')
    .concat(List<string>())
    .append(List('WOW!'));
const a: number = z.tails().foldLeft(0)((acc, t) => acc + t.size());
const b: List<Maybe<number>> = x.foldRight(z)((l, acc) => acc.append(l))
    .ap(List(Number, List(e => parseInt(e, 10))))
    .headMaybe().map(h => List(h)).orJust(List(0))
    .tails().map(t => t.filter(n => !isNaN(n)))
    .map(t => t.size() > 0 ? Some(t.head()) : None<number>());
const c: List<number> = b.flattenMaybe<number>().chain(n => y.bind(ls => ls).map(s => Number(s) + n));


const maybeList: Maybe<List<string>> = List(Some('A')).sequenceMaybe<string>();
const eitherList: Either<string, List<string>> = List(Right('A')).sequenceEither<string, string>();
const successOfList: Validation<List<string>, List<string>> = List(Success('A')).sequenceValidation<string, string>();
const ioOfList: IO<List<string>> = List(IO(() =>'A')).sequenceIO<string>();
const readerOfList: Reader<string, List<string>> = List(Reader(x => x + 'A')).sequenceReader<string, string>();

const maybeList2: Maybe<List<string>> = List(Some('A')).sequence<string>(Maybe);
const eitherList2: Either<string, List<string>> = List(Right('A')).sequence<string, string>(Either);
const successOfList2: Validation<List<string>, List<string>> = List(Success('A')).sequence<string, string>(Validation);
const ioOfList2: IO<List<string>> = List(IO(() =>'A')).sequence<string>(IO);
const readerOfList2: Reader<string, List<string>> = List(Reader(x => x + 'A')).sequence<string, string>(Reader);
