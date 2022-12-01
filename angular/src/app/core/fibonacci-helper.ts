export const getFibonacciNumbers = () => {
  const numbers = [1, 1];
  const upperCalculationLimit = 10; // Increment 100 times
  let j = 1;

  while (j <= upperCalculationLimit) {
    numbers.push(numbers[j - 1] + numbers[j]);
    j++;
  }

  numbers.shift(); // Remove the duplicate 1

  return numbers;
};
