# How to Decide What to Eat

Deciding what to eat has also been one of my biggest problems before cooking. So the only option is to describe it mathematically.

## Calculation Method

### Calculating the Number of Meat and Vegetable Dishes

* Number of dishes = number of people + 1.
* There should be one more meat dish than vegetable dishes, or the same number.

This gives you the number of meat dishes and vegetable dishes; then just pick from the recipes.

#### Formal Language Description

Given `N` people,
let the `number of vegetable dishes` be `a` and the `number of meat dishes` be `b`.
`N`, `a` and `b` are all integers.

We then have the following system of inequalities:

* a + b = N + 1
* a ≤ b ≤ a+1

Solving gives

```javascript
const a = Math.floor((N+1)/2);
const b = Math.ceil((N+1)/2);
```

### Choosing Dishes

* If there are more than 8 people, consider adding a fish dish to the meat dishes.
* If there are children, consider adding a sweet dish.
* Consider adding specialty dishes or dishes you are especially good at.
* When choosing meat dishes, don't use the same kind of meat for all of them. Consider them in this order: `pork`, `chicken`, `beef`, `lamb`, `duck`, `fish`.
* Don't choose strange animals for meat dishes.

If you still can't decide, use the [What to Eat Today?](https://github.com/ryanuo/whatToEat) tool to choose what to eat today.
