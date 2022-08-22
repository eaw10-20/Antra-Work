function double(value){
    return value*2;
}

function add(val1, val2){
    return val1 + val2;
}

const arr = [1,2,3,4,5];

// Setting up the myMap Function below
//***********************************/
Array.prototype.myMap = function(myFunc){
    let newArry = []; 
    for(let i = 0; i < this.length; i++){
        newArry[i] = myFunc(this[i])
    }
    return newArry;
}

Array.prototype.myReduce = function(myFunc, init){
    let ret, i;
    if(init){
        ret = init;
        i = 0;
    }else{
        ret = this[0];
        i = 1;
    }
    while(i < this.length){
        ret = myFunc(ret, this[i]);
        i++;
    }
    return ret;
}

console.log(arr.myMap(double));
console.log(arr.myReduce(add));
console.log(arr.myReduce(add, 10))