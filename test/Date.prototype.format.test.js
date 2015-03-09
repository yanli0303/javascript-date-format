/// <reference path="../Date.format.js" />
/// <reference path="qunit.js" />
var NOW = new Date(2012, 6, 31, 4, 49, 10, 112);        //2012-07-31 04:49:10.112

module("Date.format");
test("Year test", function () {
    equal(NOW.format('yyyy'), "2012");
    equal(NOW.format('YYYY'), "2012");
    equal(NOW.format('yy'), "12");
    equal(NOW.format('YY'), "12");
});

test("Month test", function () {
    equal(NOW.format('MMMM'), "July");
    equal(NOW.format('mmmm'), "July");

    equal(NOW.format('MMM'), "Jul");
    equal(NOW.format('mmm'), "Jul");

    equal(NOW.format('MM'), "07");

    equal(NOW.format('M'), "7");
});

test("Day test", function () {
    equal(NOW.format('ddddd'), "Tuesday");
    equal(NOW.format('DDDDD'), "Tuesday");

    equal(NOW.format('dddd'), "Tue");
    equal(NOW.format('DDDD'), "Tue");

    equal(NOW.format('ddd'), "Tu");
    equal(NOW.format('DDD'), "Tu");

    equal(NOW.format('dd'), "31");
    equal(NOW.format('DD'), "31");

    equal(NOW.format('d'), "31");
    equal(NOW.format('D'), "31");
});

test("Hour test", function () {
    equal(NOW.format('HH'), "04");
    equal(NOW.format('H'), "4");

    equal(NOW.format('hh'), "04");
    equal(NOW.format('h'), "4");
});

test("Minute test", function () {
    equal(NOW.format('mm'), "49");
    equal(NOW.format('m'), "49");
});

test("Second test", function () {
    equal(NOW.format('SS'), "10");
    equal(NOW.format('S'), "10");

    equal(NOW.format('ss'), "10");
    equal(NOW.format('s'), "10");
});

test("Million-second test", function () {
    equal(NOW.format('SSS'), "112");
    equal(NOW.format('sss'), "112");
});

test("AM/PM test", function () {
    equal(NOW.format('A'), "AM");
    equal(NOW.format('a'), "am");
});

test("Timezone test", function () {
    equal(NOW.format('Z'), "+0800");
    equal(NOW.format('z'), "GMT+08:00");
});

test("Escape test", function () {
    equal(NOW.format("''yyyy''"), "'2012'");
    equal(NOW.format("'yyyy'"), "yyyy");
});

test("All-in-one test", function () {
    equal(NOW.format("'''as is: yyyy-mm-dd''' yyyy/YYYY yy/YY mmmm/MMMM mmm/MMM MM M ddddd/DDDDD dddd/DDDD ddd/DDD dd/DD d/D HH H hh h mm m ss/SS s/S sss/SSS a A z Z"),
        "'as is: yyyy-mm-dd' 2012/2012 12/12 July/July Jul/Jul 07 7 Tuesday/Tuesday Tue/Tue Tu/Tu 31/31 31/31 04 4 04 4 49 49 10/10 10/10 112/112 am AM GMT+08:00 +0800");
});
