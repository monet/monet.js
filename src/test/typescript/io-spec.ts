import { IO } from '../../../index';

const logX = IO(() => console.log('X'));
const getY = logX.map(() => 'Y');
const getOne = getY.flatMap(y => IO.of(() => y === 'Y' ? 1 : 0));
const getTrue = getOne.bind(one => IO.io(() => Boolean(one)));

const y: string = getY.run();
const one: number = getOne.perform();
const truth: boolean = getTrue.performUnsafeIO();

const ioX: IO<void> = logX;
const ioY: IO<string> = getY;
const ioOne: IO<number> = getOne;
const ioTrue: IO<boolean> = getTrue;

//                                              what a shame…
const oneChar: IO<string> = IO.pure(() => IO(() => '1')).join<string>();

const anotherTruth: boolean = logX
    .ap(IO(() => () => '1'))
    .ap(IO.unit(() => Number))
    .ap(IO(() => Boolean))
    .run();

console.log(oneChar.takeLeft(ioTrue).takeLeft(ioX) === ioOne.takeRight(ioY));
console.log(y, one, oneChar.run(), truth, anotherTruth);
