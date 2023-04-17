let a1 = [1, 0, 1];
let a2 = [0, 1, 0];

// console.log(a1 + a2);
let result = [];

for(let i = 0; i < a1.length; i++){
    result.push(a1[i] + a2[i]);
}

console.log(result);
console.log(result.some(elem => elem == 0));
console.log(a1.some(elem => elem == 0));
console.log(a2.some(elem => elem == 0));