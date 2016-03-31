// Type definitions for monet.js v0.8.7
// Definitions by: Jakub Strojewski <https://github.com/ulfryk>, Wojciech Ptak

declare namespace monet {

    function apply2<T>(a1: IMonad<T>, a2: IMonad<T>, f: Function): IMonad<T>;

    /* The (covariant) functor typeclass */
    interface Functor<T> {
        map<V>(fn: (val: T) => V): Functor<V>;
    }

    /* Typeclass for binding, the core monadic transformation */
    interface Bind<T> {
        bind<V>(fn: (val: T) => Bind<V>): Bind<V>
        chain<V>(fn: (val: T) => Bind<V>): Bind<V>    // alias of bind
        flatMap<V>(fn: (val: T) => Bind<V>): Bind<V>  // alias of bind
        join<V>(): Bind<V>  // works only if T = Bind<V>
    }

    /* Applicative allows applying wrapped functions to wrapped elements */
    interface Applicative<T> {
        ap<V>(afn: Applicative<(val: T) => V>): Applicative<T>
    }

    /****************************************************************
     * Basic Monad Interface
     */

    interface IMonad<T> extends Functor<T>, Bind<T>, Applicative<T> {
        /* These all are defined in Functor, Bind and Applicative: */
        bind<V>(fn: (val: T) => IMonad<V>): IMonad<V>;
        flatMap<V>(fn: (val: T) => IMonad<V>): IMonad<V>;
        chain<V>(fn: (val: T) => IMonad<V>): IMonad<V>;
        map<V>(fn: (val: T) => V): IMonad<V>;
        join<V>(): IMonad<V>; // only if T = IMonad<V>

        /* These are monet-Monad-specific: */
        takeLeft(m: IMonad<T>): IMonad<T>;
        takeRight(m: IMonad<T>): IMonad<T>;
    }

    interface IMonadStatic extends Function {
        <T>(val: T): IMonad<T>;
        new <T>(val: T): IMonad<T>;
        unit<T>(val: T): IMonad<T>;
        of<T>(val: T): IMonad<T>;    // alias for unit
        pure<T>(val: T): IMonad<T>;  // alias for unit
        map2<T, V, N>(fn: (val1: T, val2: V) => N): (m1: IMonad<T>, m2: IMonad<V>) => IMonad<N>;
    }

    /****************************************************************
     * Identity
     */

    interface Identity<T> extends IMonad<T> {
        /* Inherited from Monad: */
        bind<V>(fn: (val: T) => Identity<V>): Identity<V>;
        flatMap<V>(fn: (val: T) => Identity<V>): Identity<V>;
        chain<V>(fn: (val: T) => Identity<V>): Identity<V>;
        map<V>(fn: (val: T) => V): Identity<V>;
        join<V>(): Identity<V>; // if T is Identity<V>
        takeLeft(m: Identity<T>): Identity<T>;
        takeRight(m: Identity<T>): Identity<T>;
        
        /* Identity specific */
        get(): T;
    }

    interface IIdentityStatic extends IMonadStatic {
        <V>(value: V): Identity<V>;
        unit: IIdentityStatic;
        of: IIdentityStatic;    // alias for unit
        pure: IIdentityStatic;  // alias for unit
    }

    var Identity: IIdentityStatic;

    /****************************************************************
     * Maybe
     */

    interface Maybe<T> extends IMonad<T> {
        /* Inherited from Monad: */
        bind<V>(fn: (val: T) => Maybe<V>): Maybe<V>;
        flatMap<V>(fn: (val: T) => Maybe<V>): Maybe<V>;
        chain<V>(fn: (val: T) => Maybe<V>): Maybe<V>;
        map<V>(fn: (val: T) => V): Maybe<V>;
        join<V>(): Maybe<V>; // if T is Identity<V>
        takeLeft(m: Maybe<T>): Maybe<T>;
        takeRight(m: Maybe<T>): Maybe<T>;

        /* Inherited from Applicative */
        ap<V>(maybeFn: Maybe<(val: T) => V>): Maybe<V>;

        /* Maybe specific */
        cata<Z>(none: () => Z, some: (val: T) => Z): Z;
        fold<V>(val: V): (fn: (val: T) => V) => V;

        filter(fn: (val: T) => boolean): Maybe<T>;

        isSome(): boolean;
        isJust(): boolean;
        isNone(): boolean;
        isNothing(): boolean;
        some(): T;
        just(): T;
        orSome(val: T): T;
        orJust(val: T): T;
        orElse(maybe: Maybe<T>): Maybe<T>;

        toList(): List<T>;
        toEither<E>(left?: E): Either<E, T>;
        toValidation<E>(fail?: E): Validation<E, T>;
    }

    interface ISomeStatic {
        <V>(value: V): Maybe<V>;
    }

    interface INoneStatic {
        <V>(): Maybe<V>;
    }

    interface IMaybeStatic extends IMonadStatic {
        Some: ISomeStatic;
        Just: ISomeStatic;
        None: INoneStatic;
        Nothing: INoneStatic;
        fromNull<V>(val: V): Maybe<V>;
        unit: ISomeStatic;
        of: ISomeStatic;    // alias for unit
        pure: ISomeStatic;  // alias for unit
    }

    var Some: ISomeStatic;
    var Just: ISomeStatic;
    var None: INoneStatic;
    var Nothing: INoneStatic;
    var Maybe: IMaybeStatic;

    /****************************************************************
     * Either
     */

    interface Either<E, T> extends IMonad<T> {
        /* Inherited from Monad: */
        bind<V>(fn: (val: T) => Either<E, V>): Either<E, V>;
        flatMap<V>(fn: (val: T) => Either<E, V>): Either<E, V>;
        chain<V>(fn: (val: T) => Either<E, V>): Either<E, V>;
        map<V>(fn: (val: T) => V): Either<E, V>;
        join<V>(): Either<E, V>; // if T is Either<V>
        takeLeft(m: Either<E, T>): Either<E, T>;
        takeRight(m: Either<E, T>): Either<E, T>;

        /* Inherited from Applicative */
        ap<V>(eitherFn: Either<E, (val: T) => V>): Either<E, V>;

        /* Either specific */
        cata<Z>(leftFn: (err: E) => Z, rightFn: (val: T) => Z): Z;

        bimap<Z, V>(leftFn: (err: E) => Z, rightFn: (val: T) => V): Either<Z, V>;
        leftMap<F>(fn: (leftVal: E) => F): Either<F, T>;

        isRight(): boolean;
        isLeft(): boolean;
        right(): T;
        left(): E;

        toValidation(): Validation<E, T>;
        toMaybe(): Maybe<T>;
    }

    interface IEitherStatic extends IMonadStatic {
        Right: IRightStatic;
        Left: ILeftStatic;
        unit: IRightStatic;
        of: IRightStatic;    // alias for unit
        pure: IRightStatic;  // alias for unit
    }

    interface IRightStatic {
        <F, V>(val: V): Either<F, V>;
    }

    interface ILeftStatic {
        <F, V>(val: F): Either<F, V>;
    }

    var Either: IEitherStatic;
    var Right: IRightStatic;
    var Left: ILeftStatic;

    /****************************************************************
     * Validation
     */
     
    interface IValidationAcc extends Function {
        (): IValidationAcc;
    }

    interface Validation<E, T> extends IMonad<T> {
        /* Inherited from Monad: */
        bind<V>(fn: (val: T) => Validation<E, V>): Validation<E, V>;
        flatMap<V>(fn: (val: T) => Validation<E, V>): Validation<E, V>;
        chain<V>(fn: (val: T) => Validation<E, V>): Validation<E, V>;
        map<V>(fn: (val: T) => V): Validation<E, V>;
        join<V>(): Validation<E, V>; // if T is Validation<E, V>
        takeLeft(m: Validation<E, T>): Validation<E, T>;
        takeRight(m: Validation<E, T>): Validation<E, T>;

        /* Inherited from Applicative */
        ap<V>(eitherFn: Validation<E, (val: T) => V>): Validation<E, V>;

        /* Validation specific */
        cata<Z>(failFn: (fail: E) => Z, successFn: (val: T) => Z): Z;

        bimap<F, V>(fnF: (fail: E) => F, fnS: (val: T) => V): Validation<F, V>;
        failMap<F>(fn: (fail: E) => F): Validation<F, T>;

        isSuccess(): boolean;
        isFail(): boolean;
        success(): T;
        fail(): E;

        acc(): Validation<E, IValidationAcc>;

        toEither(): Either<E, T>;
        toMaybe(): Maybe<T>;
    }

    interface IValidationStatic extends IMonadStatic {
        Success: ISuccessStatic;
        Fail: IFailStatic;
        success: ISuccessStatic;
        fail: IFailStatic;
        of: ISuccessStatic;
        pure: ISuccessStatic;
        unit: ISuccessStatic;
        point: ISuccessStatic;
    }

    interface ISuccessStatic {
        <E, T>(val: T): Validation<E, T>;
    }

    interface IFailStatic {
        <E, T>(err: E): Validation<E, T>;
    }

    var Validation: IValidationStatic;
    var Success: ISuccessStatic;
    var Fail: IFailStatic;

    /****************************************************************
     * List
     */

    interface ListFoldLeftFn<A, B> {
        (acc: B, element: A): B;
    }

    interface ListFoldRightFn<A, B> {
        (element: A, acc: B): B;
    }

    interface List<T> {
        cons(a: T): List<T>;
        map<V>(fn: (val: T) => V): List<V>;
        bind<V>(fn: (val: T) => List<V>): List<V>;
        flatMap<V>(fn: (val: T) => List<V>): List<V>;
        head(): T;
        headMaybe(): Maybe<T>;
        filter(fn: (val: T) => boolean): List<T>;
        foldLeft<V>(initial: V): (fn: ListFoldLeftFn<T, V>) => V;
        foldRight<V>(initial: V): (fn: ListFoldRightFn<T, V>) => V;
        append(list: List<T>): List<T>;
        concat(list: List<T>): List<T>;
        // if T extends IMonad<V>
        //sequence<V>(m: IMonadStatic): IMonad<List<V>>;
        //sequence<E, V>(m: IMaybeStatic): Maybe<List<V>>;
        //sequence<E, V>(m: IEitherStatic): Either<E, List<V>>;
        //sequence<E, V>(m: IValidationStatic): Validation<List<E>, List<V>>;
        //
        //sequence<U extends IMonadStatic, R extends IMonad<List<any>>>(m: U): R;
        //sequenceMaybe<V, T extends Maybe<V>>(): Maybe<List<V>>;
        //sequenceEither<E, V, T extends Either<E, V>>(): Either<E, List<V>>;
        //sequenceValidation<E, V, T extends Validation<E, V>>(): Validation<List<E>, List<V>>;
        //sequenceIO<V, T extends IO<V>>(): IO<List<V>>;
        //sequenceReader<V, T extends Reader<V>>(): Reader<List<V>>;
        reverse(): List<T>;
    }

    interface IListStatic {
        <T>(val: T, tail: List<T>): List<T>;
        new <T>(val: T, tail: List<T>): List<T>;
    }

    var List: IListStatic;

    /****************************************************************
     * IO
     */

    interface IO<T> extends IMonad<T> {
        bind<V>(fn: (val: T) => IO<V>): IO<V>;
        flatMap<V>(fn: (val: T) => IO<V>): IO<V>;
        chain<V>(fn: (val: T) => IO<V>): IO<V>;
        map<V>(fn: (val: T) => V): IO<V>;
        run(): void;
        perform(): void;
        join<V>(): IO<V>; // if T is IO<V>
        takeLeft(m: IO<T>): IO<T>;
        takeRight(m: IO<T>): IO<T>;
    }

    interface IIOStatic {
        <T>(fn: () => T): IO<T>;
        new <T>(fn: () => T): IO<T>;
    }

    var IO: IIOStatic;
    
    /****************************************************************
     * Reader
     */
    
    interface Reader<E, A> extends IMonad<A> {
        /* Inherited from Monad: */
        bind<B>(fn: (val: A) => Reader<E, B>): Reader<E, B>;
        flatMap<B>(fn: (val: A) => Reader<E, B>): Reader<E, B>;
        chain<B>(fn: (val: A) => Reader<E, B>): Reader<E, B>;
        map<B>(fn: (val: A) => B): Reader<E, B>;
        join<B>(): Reader<E, B>; // if A is Reader<E, B>
        takeLeft<X>(m: Reader<E, X>): Reader<E, A>;
        takeRight<B>(m: Reader<E, B>): Reader<E, B>;
        ap<B>(rfn: Reader<E, (val: A) => B>): Reader<E, B>;

        /* Reader-specific: */
        run(config: E): A;
        local<X>(fn: (val: X) => E): Reader<X, A>;
    }
    
    interface ReaderStatic {
        <E, A>(fn: (env: E) => A): Reader<E, A>;
        unit<E, A>(val: A): Reader<E, A>;
        of<E, A>(val: A): Reader<E, A>;   // alias for unit
        pure<E, A>(val: A): Reader<E, A>  // alias for unit
        point<E, A>(val: A): Reader<E, A> // alias for unit
        ask<E>(): Reader<E, E>;
        new <E, A>(fn: (env: E) => A): Reader<E, A>;
        
    }
    
    var Reader: ReaderStatic;


    /****************************************************************
     * Free
     */
    interface Free<A> extends IMonad<A> {
        /* A free monad over functor F.
         * It holds values of type F<A> for some functor F.
         * 
         *
         * Typing caveats:
         * TypeScript does not support higher-kinded types, meaning you can't
         * just specify the type of the functor. This leads to the following issues:
         *
         * 1. Some methods operating on type T require FT or FFT as type parameters.
         *    FT = F<T> and FFT = F<Free<T>>, but we can't simply infer that.
         * 2. The Free<A> interface does not include the information on what kind
         *    of functor is used. So it is possible to `bind` two free monads
         *    over different functors. This will most likely crash, and we can't
         *    statically prohibit it. As a general rule, free monads over different
         *    functors are totally incompatible.
         */
        bind<V>(fn: (val: A) => Free<V>): Free<V>;
        flatMap<V>(fn: (val: A) => Free<V>): Free<V>;
        chain<V>(fn: (val: A) => Free<V>): Free<V>;
        join<V>(): Free<V>; // only if A = Free<V> on the same functor
        map<V>(fn: (val: A) => V): Free<V>;
        takeLeft<X>(other: Free<X>): Free<A>;
        takeRight<B>(other: Free<B>): Free<B>;


        /* Free-specific: */
        // evaluates a single layer
        resume<FFA>(): Either<FFA, A>; 
        // runs to completion using given extraction function:
        go<FFA>(extract: (sus: FFA) => Free<A>): A;
    }

    interface IFreeStatic {
        Return: IReturnStatic;
        Suspend: ISuspendStatic;
        of<A, FFA>(ffa: FFA): Free<A>; // alias of Suspend
        liftF<A, FA>(fa: FA): Free<A>; // FA = F<A>

    }

    interface IReturnStatic {
      <A>(a: A): Free<A>;
      new <A>(a: A): Free<A>;
    }

    interface ISuspendStatic {
      <A, FFA>(ffa: FFA): Free<A>;
      new <A, FFA>(ffa: FFA): Free<A>;
    }

    var Free: IFreeStatic;
    var Return: IReturnStatic;
    var Suspend: ISuspendStatic;

}

declare module "monet" {
    export = monet;
}


/* Browser global variables */
declare var Identity: monet.IIdentityStatic;
declare var Maybe: monet.IMaybeStatic;
declare var Just: monet.ISomeStatic;
declare var Some: monet.ISomeStatic;
declare var None: monet.INoneStatic;
declare var Nothing: monet.INoneStatic;
declare var Either: monet.IEitherStatic;
declare var Right: monet.IRightStatic;
declare var Left: monet.ILeftStatic;
declare var Validation: monet.IValidationStatic;
declare var Success: monet.ISuccessStatic;
declare var Fail: monet.IFailStatic;
declare var List: monet.IListStatic;
declare var IO: monet.IIOStatic;
declare var Reader: monet.ReaderStatic;
declare var Free: monet.IFreeStatic;
declare var Return: monet.IReturnStatic;
declare var Suspend: monet.ISuspendStatic;
