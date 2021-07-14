/**
 *  改造加减乘除，解决精度丢失
 * @author youai
 * @date 2021/7/14
 */
/**
 * floatObj 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * floatObj.add(0.1, 0.2) >> 0.3
 * floatObj.multiply(19.9, 100) >> 1990
 *
 */

// 柯里化
const floatObj = function(...args){
    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    function toInteger(floatNum) {
        // 先判断类型,非number，默认赋值0，避免出现NaN
        if(typeof floatNum !== 'number' || floatNum === NaN){
            floatNum = 0;
        }
        const ret = {times: 1, num: 0}

        // Math.floor 向下取整，判断是否是整数
        if (Math.floor(floatNum) === floatNum) {
            ret.num = floatNum
            return ret
        }

        const strfi  = floatNum + ''
        // 小数点位数
        const len = strfi.length - 1 - strfi.indexOf('.');
        // 放大的倍数
        const times = Math.pow(10, len);
        // 放大后的数值
        let intNum = parseInt(Math.abs(floatNum) * times, 10);
        ret.times  = times
        // 判断是否是负数, 因用Math.abs取了绝对值
        const isNegative = floatNum < 0
        if (isNegative) {
            intNum = -intNum
        }
        ret.num = intNum
        return ret
    }

    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    function operation(a, b, op) {
        const o1 = toInteger(a);
        const o2 = toInteger(b);
        const n1 = o1.num;
        const n2 = o2.num;
        const t1 = o1.times;
        const t2 = o2.times;
        const max = t1 > t2 ? t1 : t2;
        let result = null;
        switch (op) {
            case `add`:
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max
            case 'multiply':
                result = (n1 * n2) / (t1 * t2)
                return result
            case 'divide':
                result = (n1 / n2) * (t2 / t1)
                return result
            default:
                return 0;
        }
    }

    let parmas = args
    function sum(){
        parmas = [...parmas,...arguments]
        return  sum
    }
    sum.add=function(){
        return parmas.reduce((acc,item)=>{
            return operation(acc,item,'add')
        })
    }
    sum.subtract=function(){
        return parmas.reduce((acc,item)=>{
            return operation(acc,item,'subtract')
        })
    }
    sum.multiply=function(){
        return parmas.reduce((acc,item)=>{
            return operation(acc,item,'multiply')
        })
    }
    sum.divide=function(){
        return parmas.reduce((acc,item)=>{
            return operation(acc,item,'divide')
        })
    }
    return sum
}();

export default floatObj
