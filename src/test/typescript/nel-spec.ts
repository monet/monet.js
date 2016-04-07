import { NonEmptyList, NEL, List, Nil, Maybe } from '../../../index';

const nel: NEL<string> = NonEmptyList('a', List('b'));
const nonempty: NonEmptyList<number> = NEL(0, List(12));
const nelBool: NEL<boolean> = nel.flatMap((str: string) => NEL.of(!str, List(Boolean(str))));
const nil = nelBool.filter(a => a).filter(a => !a);
const nel2 = NEL.fromList(nil).cata(() => NEL.unit(true), a => a);
const nel3 = NEL.fromList(Nil).cata(() => NEL.pure(true), a => a);
const taken: NonEmptyList<number> = nel2.takeLeft(nel3).takeRight(nonempty);
const tail: List<number> = taken.tail();
const xx: NEL<number> = taken.tails().map(e => e.head()).mapTails(t => t.extract()).cojoin().bind(t => t).reverse();
const yy: NEL<string> = xx.cobind(t => t.ap(NonEmptyList(String))).coflatMap(t => t.extract()).head();
const foldedL: Maybe<NEL<string>> = NonEmptyList.fromList(tail).map(t =>
    t.tails().foldLeft(yy)((acc, n) => acc.concat(n.ap(NEL(String)))));
const foldedR: NonEmptyList<boolean> = foldedL.map(f => f.cojoin()).map(ff => ff.foldRight(nelBool)((v, acc) =>
    acc.append(v.map(Boolean)))).orJust(nelBool);

console.log(true === foldedR.reduceLeft((acc, n) => acc && n));
