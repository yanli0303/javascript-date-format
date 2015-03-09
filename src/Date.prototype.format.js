//Pattern ref: http://download.oracle.com/javase/1.4.2/docs/api/java/text/SimpleDateFormat.html
//    escape:
//        ''              = single quote(') is the escape character, two single quotes will become one in the outputs;
//        'as is'         = texts quoted by single quotes will be outputed as is(with single quotes trimmed).
//    year:
//        yyyy or YYYY    = four digits year;
//        yy or YY        = 2 digits year;
//    month:
//        M               = month number without leading zeros;
//        MM              = month number with leading zeros;
//        MMM or mmm      = month abbreviation (Jan, Feb ... Dec);
//        MMMM or mmmm    = long month (January, February ... December);
//    day:
//        d or D          = day of month without leading zeros;
//        dd or DD        = day of month with leading zeros;
//        ddd or DDD      = day of week abbreviation, 2 letters (Mo, Tu ... Su);
//        dddd or DDDD    = day of week abbreviation, 3 letters (Mon, Tue ... Sun);
//        ddddd or DDDDD  = long week day name (Monday, Tuesday ... Sunday);
//    hour:
//        h       = hour number without leading zeros (1-12);
//        hh      = hour number with leading zeros (1-12);
//        H       = hour number without leading zeros (0-23);
//        HH      = hour number with leading zeros (0-23);
//    minute:
//        m       = minute number without leading zeros;
//        mm      = minute number with leading zeros;
//    second:
//        s or S      = second number without leading zeros;
//        ss or SS    = second number with leading zeros;
//    am/pm:
//        a       = am or pm
//        A       = AM or PM
//    millisecond:
//        sss or SSS  = milliseconds
//    time zone:
//        time zone name (Pacific Standard Time; PST) isn't supported for now. ref https://bitbucket.org/pellepim/jstimezonedetect/overview
//        z       = GMT-08:00
//        Z       = -0800 (RFC 822 time zone)
(function () {
    'use strict';
    var LANG = {
        WeekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        ShortWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        VeryShortWeekDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        Months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        ShortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        AM: "AM",
        LowerAM: "am",
        PM: "PM",
        LowerPM: "pm"
    }, OVERALL_EX = /(\'\')|(\'[^']+\')|(y{4})|(y{2})|(m{1,4})|(d{1,5})|(h{1,2})|(s{1,3})|([az])/ig;

    function createPatternValueMap(dateObj) {
        var fullYear = dateObj.getFullYear(), //1700 - 9999
            month = dateObj.getMonth() + 1, //1 - 12
            weekDay = dateObj.getDay(), //0 - 6
            dayOfMonth = dateObj.getDate(), //1 - 31

            hour = dateObj.getHours(), //0 - 23
            hour12 = hour % 12 || 12, //1 - 12

            minute = dateObj.getMinutes(), //0 - 59
            seconds = dateObj.getSeconds(), //0 - 59
            ms = dateObj.getMilliseconds(), //0 - 999

            tz = -dateObj.getTimezoneOffset(), //total minutes from GMT
            timeZoneSign = tz > 0 ? "+" : "-", //timezone symbol
            tzh = Math.floor(Math.abs(tz) / 60), //time zone hours
            timeZoneHour = (tzh > 9 ? "" : "0") + tzh, //string of time zone hours with leading zero
            tzm = Math.abs(tz) % 60, //time zone minutes
            timeZoneMinute = (tzm > 9 ? "" : "0") + tzm, //string of time zone minutes with leading zero

            map = {};

        //year:
        //  yyyy or YYYY
        map.yyyy = map.YYYY = fullYear.toString();

        //  yy or YY
        map.yy = map.YY = fullYear.toString().substr(2);


        //month:
        //  mmmm or MMMM
        map.mmmm = map.MMMM = LANG.Months[month - 1];

        //  mmm or MMM
        map.mmm = map.MMM = LANG.ShortMonths[month - 1];

        //  MM
        map.MM = (month > 9 ? "" : "0") + month;

        //  M
        map.M = month.toString();


        //day:
        //  ddddd or DDDDD
        map.ddddd = map.DDDDD = LANG.WeekDays[weekDay];

        //  dddd or DDDD
        map.dddd = map.DDDD = LANG.ShortWeekDays[weekDay];

        //  ddd or DDD
        map.ddd = map.DDD = LANG.VeryShortWeekDays[weekDay];

        //  dd or DD
        map.dd = map.DD = (dayOfMonth > 9 ? "" : "0") + dayOfMonth;

        //  d or D
        map.d = map.D = dayOfMonth.toString();


        //hour:
        //  HH
        map.HH = (hour > 9 ? "" : "0") + hour;

        //  H
        map.H = hour.toString();

        //  hh
        map.hh = (hour12 > 9 ? "" : "0") + hour12;

        //  h
        map.h = hour12.toString();


        //minute:
        //  mm
        map.mm = (minute > 9 ? "" : "0") + minute;

        //  m
        map.m = minute.toString();


        //million second
        //  sss or SSS
        map.sss = map.SSS = ms.toString();


        //second
        //  ss or SS
        map.ss = map.SS = (seconds > 9 ? "" : "0") + seconds;

        //  s or S
        map.s = map.S = seconds.toString();


        //am/pm
        //  A
        map.A = hour < 12 ? LANG.AM : LANG.PM;

        //  a
        map.a = hour < 12 ? LANG.LowerAM : LANG.LowerPM;


        //time zone
        //  Z: -0800 (RFC 822 time zone)
        map.Z = timeZoneSign + timeZoneHour + timeZoneMinute;

        //  z: GMT-08:00
        map.z = "GMT" + timeZoneSign + timeZoneHour + ":" + timeZoneMinute;

        return map;
    }

    Date.prototype.format = function (pattern) {
        var map = createPatternValueMap(this);
        //escape char
        map["''"] = "'";

        return pattern.replace(OVERALL_EX, function (match, captures) {
            //Leave single quoted texts as is(with quote trimmed).
            if (match.length > 2 && match[0] === "'") {
                return match.substr(1, match.length - 2);
            }

            return map.hasOwnProperty(match) ? map[match] : match;
        });
    };
} ());