import { Free, Functor } from '../../../index';

// I hope you don't write real app this way, but this
// is not a good place to pull in Coyonedas and IO
class LoggingFunctor<A> implements Functor<A> {
  constructor(public run: () => A, public msg: string) {}
  map<B>(fn: (a: A) => B): LoggingFunctor<B> {
    return new LoggingFunctor<B>(() => fn(this.run()), this.msg);
  }
}

type LoggingMonad<A> = Free<A>; // with Logging Functor

interface DbRecord {
  id: string
  next: string
  content: string
}

function fakeRecord(id: string): DbRecord {
  return { id: id, next: `${id}-next`, content: `fake content for id ${id}` };
}

function get(id: string): LoggingFunctor<DbRecord> {
  return new LoggingFunctor<DbRecord>(() => fakeRecord(id), `getting record ${id}`);
}

function getFree(id: string): Free<DbRecord> {
  return Free.liftF<DbRecord, LoggingFunctor<DbRecord>>(get(id));
}

const record: LoggingMonad<DbRecord> = getFree("base");
const next: LoggingMonad<DbRecord> = record.bind(r => getFree(r.next));
const content: LoggingMonad<string> = next.map(r => r.content);

function extractLog<A>(ffa: LoggingFunctor<Free<A>>): LoggingMonad<A> {
  console.log(`Log: ${ffa.msg}`);
  return ffa.run();
}

const extracted: string = content.go(extractLog);
