const fs = require('fs');
function question1 () {
    fs.readFile('./note.txt', (err, data) =>{
        str = data.toString();
        const array = str.split("");
        console.time('1');
        const floor = array.reduce((acc, currentValue) => {
            if (currentValue == '('){
                acc++;
            }
            else{
                acc--;
            }
            return acc;
        }, 0)
        console.log('1st', floor);
        console.timeEnd('1');
        console.time('2');

        const up = array.filter(x=>x == '(').length;
        const down = array.filter(x=>x == ')').length;

        const answer = (up - down);

        console.log('second', answer);
        console.timeEnd('2');

    });

        
}

question1();

// const array = str.split("");
// const floor = 0;
// console.log(array);
// array.map( (i) => {
//     if (i == '(') {
//         floor++;
//     }
//     else {
//         floor--;
//     }
// })

// console.log(floor);

