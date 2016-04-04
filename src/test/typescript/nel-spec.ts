import { NonEmptyList, NEL } from 'monet';

const nel: NEL<string> = NonEmptyList('a', NonEmptyList('b'));
const nonempty: NonEmptyList<number> = NEL(0, NEL(12));
