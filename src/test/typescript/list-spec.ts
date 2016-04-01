import { List, Maybe, Some, Either, Right, Validation, Success, IO, Reader } from 'monet';




// TODO: add more tests




const maybeList: Maybe<List<string>> = List(Some('A')).sequenceMaybe<string>();
const eitherList: Either<string, List<string>> = List(Right('A')).sequenceEither<string, string>();
const successWithList: Validation<List<string>, List<string>> = List(Success('A')).sequenceValidation<string, string>();
const ioOfList: IO<List<string>> = List(IO(() =>'A')).sequenceIO<string>();
const readerOfList: Reader<string, List<string>> = List(Reader(x => x + 'A')).sequenceReader<string, string>();
