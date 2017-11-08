const timestamp = require('../server/api/services/timestamp.js')
var assert = require('assert');


let MONTHS = ['January', 'February', 'March', 
    'April', 'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December']

function isMonth(str, months){
    return months
        .filter((a) => a === str)
        .length > 0
}

function isDay(str){
    return parseInt(str) > 0 <= 31
}

function isYear(str){
    return parseInt(str) > 0 <= 9999
}

function isNaturalDate(m, d, y, months){
    return isMonth(m, months) && isDay(d.split(',')[0]) && isYear(y)
}

function naturalDateToUnixTimestamp(m, d, y, months){
    let _m = m.split('').slice(0,3).join('')

    if ( !isNaN(_m) || isNaN(d+y)) return ""  

    let date  = new Date(_m+' '+d+' '+y),
        year  = date.getUTCFullYear(),
        month = date.getUTCMonth(),
        day   = date.getUTCDate()

    return Date.UTC(year, month, day)/1000 + ""
}

function isUnixTimeStamp(s){
    return s > 0
}

function unixTimestampToNaturalDate(s, months){
    let date = new Date(s*1000)
    return months[date.getUTCMonth()]+' '+date.getUTCDate()+', '+date.getUTCFullYear()
}

function tryInputToTimestamp(str, months, err){

    let s = parseInt(str)

    if (isUnixTimeStamp(s)) {
        return {
            unix: str,
            natural: unixTimestampToNaturalDate(s, months)
        }
    }
    let partials = str.split(' ')
    if (partials.length < 3) return err

    let m = partials[0],
        d = partials[1].split(',')[0],
        y = partials[2]

    if (isNaturalDate(m, d, y, months)){
        return {
            unix: naturalDateToUnixTimestamp(m, d, y, months),
            natural: str
        }
    } 

    return err
}

describe("timestamp", function(){

    let months = MONTHS

    it("should accept unix timestamps", () => {
        assert(isUnixTimeStamp(-1450137600) === false, "Reject negative integer");
        assert(isUnixTimeStamp("agfdfasd") === false, "Reject string test");
        assert(isUnixTimeStamp(1450137600) === true, "Final pass");
    })
    it("should accept natural dates", ()=> {
        assert(isNaturalDate("Decembers", "15", "2015", months) === false, "Reject invalid month");
        assert(isNaturalDate("Decembers", "BLEH", "2015", months) === false, "Reject invalid date");
        assert(isNaturalDate("Decembers", "15", "YARG", months) === false, "Reject invalid year");
        assert(isNaturalDate("December", "15", "2015", months) === true, "Final pass");
    })
    it("converts timestamps to natural dates", ()=> {
        assert.equal(unixTimestampToNaturalDate("1450137600", months), "December 15, 2015", "Final pass")
    })
    it("converts natural dates to timestamps", ()=> {
        assert.equal(naturalDateToUnixTimestamp("December", "15", "2015", months), "1450137600", "Final Pass")
    })
    
    it("evaluates timestamps", () => {
        let err = { unix: "", natural: "" },
            a = tryInputToTimestamp("December 15, 2015", months, err),
            b = tryInputToTimestamp("1450137600", months, err),
            c = tryInputToTimestamp("adflkadjsg", months, err)

        assert.equal(a.unix, "1450137600", "Unix input")
        assert.equal(b.natural, "December 15, 2015", "Natural date input")
        assert.equal(c.unix + c.natural, "", "Invalid input")
    })
})
