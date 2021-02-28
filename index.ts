// ======
// PART 1
// ======

/**
 * Implement, as best as you can, the identity function in your
 * favorite language (or the second favorite, if your favorite
 * language happens to be Haskell).
 */

function id<A>(x: A): A {
  return x
}

/**
 * Implement the composition function in your favorite language.
 * It takes two functions as arguments and returns a function
 * that is their composition.
 */

function compose<A, B, C>(f: (fx: B) => C, g: (gx: A) => B): (x: A) => C {
  return (x: A) => f(g(x))
}

/**
 * Write a program that tries to test that your composition
 * function respects identity.
 */

const toStr: <A>(x: A) => string = x => `${x}`

// somehow, typescript can not handle these ones...

// @ts-ignore
const aStr: <A>(x: A) => string = compose(toStr, id)
// @ts-ignore
const bStr: <A>(x: A) => string = compose(id, toStr)

console.log(aStr(1337) === bStr(1337))

/**
 * Is the world-wide web a category in any sense? Are links morphisms?
 *
 * Answer:
 * If web pages are objects, it might be a category. Morphisms are just links
 * between pages. If there is a link from A to B and a link from B to C,
 * there is also a way to go from A to C.
 **/

/**
 * Is Facebook a category, with people as objects and friendships as morphisms?
 *
 * Answer:
 * No, because a morphism (friendship in this case) from A to B and one from B to C does not imply
 * a way from A to C.
 */

/**
 * When is a directed graph a category?
 *
 * Answer:
 * When there is an edge from each node to itself and for each two nodes A and B there is a directed edge from A to B.
 */

// ======
// PART 2
// ======

/**
 * Define a higher-order function (or a function object) memoize in your favorite language.
 * This function takes a pure function f as an argument and returns a function
 * that behaves almost exactly like f, except that it only calls the original
 * function once for every argument, stores the result internally, and subsequently
 * returns this stored result every time it’s called with the same argument.
 * You can tell the memoized function from the original by watching its performance.
 * For instance, try to memoize a function that takes a long time to evaluate.
 * You’ll have to wait for the result the first time you call it, but on subsequent calls,
 * with the same argument, you should get the result immediately.
 */

function memoize<A, B>(f: (fx: A) => B): (x: A) => B {
  const memoized = new Map<A, B>();
  return (x: A) => {
    const from_map: B | undefined = memoized.get(x)
    if (!from_map) {
      const res: B = f(x)
      memoized.set(x, res)
      console.warn("COMPUTED FOR", x)
      return res
    }
    console.warn("CACHE HIT FOR", x)
    return from_map
  }
}

const toStrMem: <A>(x: A) => string = memoize(toStr)

toStrMem("ABC")
toStrMem("ABC")
toStrMem("DEF")

/**
 * Try to memoize a function from your standard library that you normally use
 * to produce random numbers. Does it work?
 *
 * Answer: Kinda, when setting input as an element of void. Otherwise, no argument
 * would be given to use as cached key.
 */

const randMem: (_: void) => number = memoize(Math.random)

console.log("Mem random", randMem())
console.log("Mem random", randMem())
console.log("Mem random", randMem())

/**
 * How many different functions are there from Bool to Bool?
 * Can you implement them all?
 */

const constFn: <A>(x: A) => () => A = <A>(x: A) => () => x

const bool_id: (x: boolean) => boolean = id
const bool_not: (x: boolean) => boolean = (x: boolean) => !x
const bool_true: (x: boolean) => boolean = constFn(true)
const bool_false: (x: boolean) => boolean = constFn(false)

console.log(bool_false(true))

interface Monoid<A> {
  mempty: A;
  mappend: (x: A) => (y: A) => A
}

const uncurry2: <A, B, C>(f: (x: A) => (y: B) => C) => (x: A, y: B) => C =
  <A, B, C>(f: (x: A) => (y: B) => C) => (x: A, y: B) => f(x)(y)

const stringMonoid: Monoid<string> = {
  mempty: "",
  mappend: (x: string) => (y: string) => x + y
};

console.log(["foo", "bar", "baz"].reduce(uncurry2(stringMonoid.mappend), stringMonoid.mempty))

