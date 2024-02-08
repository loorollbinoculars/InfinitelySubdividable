let widths = [0.1,0.5,0.3,0.1,0]

// 0.1, 0.6, 0.9, 1.0

console.log(widths.reduce((accumulator, currentValue, currentIndex, widths)=>{
    console.log([accumulator, currentValue])
    let diff = Math.abs(accumulator - 0.99)
    console.log("Diff: " + diff)
    if(diff<=0.02){
        console.log("reached")
        console.log(currentIndex)
    }else{
        if(currentIndex>=widths.length){
            console.log("Missed it!")
            return null
        } }
        return accumulator + currentValue
   
}, 0))