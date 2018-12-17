function startCalc() {

    //view calc
    $("body").empty().append(
        "<header class='header text-center'>" +
        "<span>Calculator</span>" +
        "</header>" +
        "<div class='text-center'>" +
        "<section id='main' class='card-body row justify-content-center'></section>" +
        "</div>" +
        "<footer class='footer text-center'>" +
        "<div class='container' style='width: 320px'>" +
        "<span class='text-muted'>Created with inspiration</span>" +
        "<div class='text-left'>" +
        "<h4 class='text-muted'>Some keys: </h4>" +
        "<p class='text-muted'>Delete - delete one digit</p>" +
        "<p class='text-muted'>Backspace - clear last element</p>" +
        "<p class='text-muted'>Space - clear all</p>" +
        "</div>" +
        "</div>"+
        "</footer>"
    );

    $("#main").append(
        "<div id='calc-container'>" +
        "<input type='text' id='exp-view' disabled>" +
        "</br>" +
        "<input type='text' id='nums-view' value='0' disabled>" +
        "<div id='row_1'></div>" +
        "<div id='row_2'></div>" +
        "<div id='row_3'></div>" +
        "<div id='row_4'></div>" +
        "<div id='row_5'></div>" +
        "<div id='row_6'></div>" +
        "</div>"
    );

    $("#row_1").append(
        "<button id='single-operation' class='calc calc-wide'>Single operation</button>" +
        "<button id='expression' class='calc calc-wide'>Expression</button>"
    );

    $("#row_2").append(
        "<button id='ce' class='calc'>CE</button>" +
        "<button id='c' class='calc'>C</button>" +
        "<button id='del' class='calc'>&#11104;</button>" +
        "<button id='divide' class='calc last-column'>&#247;</button>"
    );

    $("#row_3").append(
        "<button id='7' class='calc nums'>7</button>" +
        "<button id='8' class='calc nums'>8</button>" +
        "<button id='9' class='calc nums'>9</button>" +
        "<button id='multiply' class='calc last-column'>&#215;</button>"
    );

    $("#row_4").append(
        "<button id='4' class='calc nums'>4</button>" +
        "<button id='5' class='calc nums'>5</button>" +
        "<button id='6' class='calc nums'>6</button>" +
        "<button id='-' class='calc last-column'>-</button>"
    );

    $("#row_5").append(
        "<button id='1' class='calc nums'>1</button>" +
        "<button id='2' class='calc nums'>2</button>" +
        "<button id='3' class='calc nums'>3</button>" +
        "<button id='+' class='calc last-column'>+</button>"
    );

    $("#row_6").append(
        "<button id='revert' class='calc'>&#177;</button>" +
        "<button id='0' class='calc nums'>0</button>" +
        "<button id='dot' class='calc nums'>.</button>" +
        "<button id='equal' class='calc last-column'>=</button>"
    );

    //styling by bootstrap
    $(".calc").addClass('btn btn-light border-light rounded-0 shadow-none btn-lg');
    $(".nums").addClass('font-weight-bold');
    $(".last-column").addClass('btn-outline-primary');
    $(".last-column").css('color', 'black');
    $(".last-column").hover(
        function () {
            $(this).css('color', 'white');
        },
        function () {
            $(this).css('color', 'black');
        });
    $(".calc").css('height', '50');
    $(".calc").css('width', '80');
    $(".calc-wide").css('width', '160');

    $("#exp-view").addClass('border-0');
    $("#exp-view").css('text-align', 'end');
    $("#exp-view").css('height', '40');
    $("#exp-view").css('width', '320');
    $("#nums-view").addClass('border-0 font-weight-bold');
    $("#nums-view").css('font-size', '200%', 'text-align', 'end');
    $("#nums-view").css('text-align', 'end');
    $("#nums-view").css('height', '50');
    $("#nums-view").css('width', '320');

    $("#calc-container").addClass('border');
    $("#calc-container").css('width', '322');
    //end styling
    //end of view calc

    $(document).keypress(function(event) {
        if (event.charCode === 48) {
            $("#0").click();
        } else if (event.charCode === 49) {
            $("#1").click();
        } else if (event.charCode === 50) {
            $("#2").click();
        } else if (event.charCode === 51) {
            $("#3").click();
        } else if (event.charCode === 52) {
            $("#4").click();
        } else if (event.charCode === 53) {
            $("#5").click();
        } else if (event.charCode === 54) {
            $("#6").click();
        } else if (event.charCode === 55) {
            $("#7").click();
        } else if (event.charCode === 56) {
            $("#8").click();
        } else if (event.charCode === 57) {
            $("#9").click();
        } else if (event.charCode === 61) {
            $("#equal").click();
        } else if (event.charCode === 13) {
            $("#equal").click();
        } else if (event.charCode === 46) {
            $("#dot").click();
        } else if (event.charCode === 47) {
            $("#divide").click();
        } else if (event.charCode === 42) {
            $("#multiply").click();
        } else if (event.charCode === 45) {
            $("#-").click();
        } else if (event.charCode === 43) {
            $("#\\+").click();
        } else if (event.charCode === 32) {
            $("#c").click();
        }
    });
    //it is used because of keypress which works only on keys, which could be printed, but keypress is more
    // universal (under one code there are two different keys with same meaning)
    $(document).keydown(function(event) {
        if (event.keyCode === 8) {
            $("#del").click();
        } else if (event.keyCode === 46) {
            $("#ce").click();
        }
    });

    let singleOperation = true;
    let viewedNumber = '0';
    let digits = [viewedNumber];
    let operators = [];
    let regexDigit = new RegExp("^([0-9]|dot)$");
    let regexOperator = new RegExp("^(divide|multiply|-|\\+)$");
    let expression;

    $(":button").click(function() {
        let buttonId = $(this).attr('id');
        //click a digit. single operation
        if (regexDigit.test(buttonId) && buttonId !== 'dot' && digits.length > operators.length && digits[digits.length-1].length < 16) {
            if (digits[digits.length-1] === '0') {
                viewedNumber = digits[digits.length-1] = buttonId;
            } else {
                viewedNumber = digits[digits.length-1] = String(digits[digits.length-1]) + String(buttonId);
            }
        } else if (buttonId === 'dot' && digits.length > operators.length && digits[digits.length-1].length < 16) {
            if (digits[digits.length - 1].indexOf('.') === -1) {
                viewedNumber = digits[digits.length - 1] = String(digits[digits.length - 1]) + '.';
            }
        } else if (regexDigit.test(buttonId) && digits.length === operators.length) {
            if (buttonId === 'dot') {
                viewedNumber = digits[digits.length] = '0.';
            } else {
                viewedNumber = digits[digits.length] = buttonId;
            }
        }

        //check single operation
        if (buttonId === 'single-operation') {
            if (!singleOperation) {
                expression = null;
                viewedNumber = '0';
                operators = [];
                digits = [viewedNumber];
                singleOperation = true;
            }
        }

        //check expression
        if (buttonId === 'expression') {
            if (singleOperation) {
                expression = null;
                viewedNumber = '0';
                operators = [];
                digits = [viewedNumber];
                singleOperation = false;
            }
        }

        //click CE. Last digit becomes equals zero.
        if (buttonId === 'ce') {
            if (digits.length === operators.length) {
                digits.push('0');
                viewedNumber = digits[digits.length-1];
            } else if (digits.length > operators.length) {
                viewedNumber = digits[digits.length-1] = '0';

            }
        }

        //click C. Clear all.
        if (buttonId === 'c') {
            expression = null;
            viewedNumber = '0';
            operators = [];
            digits = [viewedNumber];

        }

        //click <-. Delete last digit if there are no operators.
        if (buttonId === 'del') {
            if (digits.length > operators.length) {
                let str = digits[digits.length-1];
                console.log("str1 " + str);
                if (str.length > 1) {
                    str = str.substring(0, (str.length - 1));
                    console.log("str2 " + str);
                } else {
                    str = '0';
                    console.log("str0 " + str);
                }
                viewedNumber = digits[digits.length-1] = str;
                console.log("viewedNumber " + viewedNumber);
            }
        }

        //click +-. Revert sign of number.
        if (buttonId === 'revert')
            if (digits.length > operators.length) {
                let str = digits[digits.length-1];
                if (str !== '0') {
                    if (str.startsWith('-')) {
                        str = str.substring(1);
                    } else {
                        str = "-" + parseFloat(str);
                    }
                }
                viewedNumber = digits[digits.length-1] = str;
            }

        if (regexOperator.test(buttonId)) {
            let str = digits[digits.length-1];
            if (str.endsWith('.')) {
                str = str.substring(0, (str.length - 1));
                viewedNumber = digits[digits.length-1] = str;
            }
            //can do operations with number after '=' pressing
            if (digits.length === 1) {
                digits[0] = viewedNumber;
            }

            if (buttonId === 'divide') {
                if (digits.length > operators.length) {
                    operators.push('/');
                } else {
                    operators[operators.length - 1] = '/';
                }
            }

            if (buttonId === 'multiply') {
                if (digits.length > operators.length) {
                    operators.push('*');
                } else {
                    operators[operators.length - 1] = '*';
                }
            }

            if (buttonId === '-') {
                if (digits.length > operators.length) {
                    operators.push('-');
                } else {
                    operators[operators.length - 1] = '-';
                }
            }

            if (buttonId === '+') {
                if (digits.length > operators.length) {
                    operators.push('+');
                } else {
                    operators[operators.length - 1] = '+';
                }
            }

            //rendering of intermediate result
            // press 1 view 1
            // press + view 1
            // press 2 view 2
            // press + view 3 <- rendering this digit
            if (operators.length > 1 && singleOperation) {
                let tempNumber = digits[0];
                for (let i = 1; i < digits.length; i++) {
                    tempNumber = makeOperation(tempNumber, digits[i], operators[i-1]);
                }
                viewedNumber = tempNumber;
            }
        }

        if (buttonId === 'equal') {
            expression = null;
            if (singleOperation) {
                if (digits.length > operators.length && digits.length > 1) {
                    for (let i = 0; i < operators.length; i++) {
                        digits[i+1] = makeOperation(digits[i], digits[i+1], operators[i]);
                    }
                    viewedNumber = digits[digits.length-1];
                    operators = [];
                    digits = ['0'];
                } else if (digits.length === operators.length && digits.length > 0) {
                    for (let i = 0; i < operators.length; i++) {
                        if (digits.length > i+1) {
                            digits[i+1] = makeOperation(digits[i], digits[i+1], operators[i]);
                        } else {
                            digits[i+1] = makeOperation(digits[i], digits[i], operators[i]);
                        }
                    }
                    viewedNumber = digits[digits.length-1];
                    operators = [];
                    digits = ['0'];
                }
            } else {
                if (digits.length > operators.length && digits.length > 1) {
                    for (let i = 0; i < operators.length; i++) {
                        digits[i+1] = digits[i] + operators[i] + digits[i+1];
                    }
                    viewedNumber = eval(digits[digits.length-1]);
                    operators = [];
                    digits = ['0'];
                } else if (digits.length === operators.length && digits.length > 0) {
                    for (let i = 0; i < operators.length; i++) {
                        if (digits.length > i+1) {
                            digits[i+1] = digits[i] + operators[i] + digits[i+1];
                        } else {
                            digits[i+1] = digits[i] + operators[i] + digits[i];
                        }
                    }
                    viewedNumber = eval(digits[digits.length-1]);
                    operators = [];
                    digits = ['0'];
                }
            }

        }

        function makeOperation(firstNumber, secondNumber, operator) {
            let result;
            if (operator === '/') {
                result = parseFloat(firstNumber) / parseFloat(secondNumber);
            } else if (operator === '*') {
                result = parseFloat(firstNumber) * parseFloat(secondNumber);
            } else if (operator === '-') {
                result = parseFloat(firstNumber) - parseFloat(secondNumber);
            } else if (operator === '+') {
                result = parseFloat(firstNumber) + parseFloat(secondNumber);
            }
            return result;
        }

        //function of commas adding
        let numberWithCommas = (x) => {
            let parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        };

        //rendering
        $("#nums-view").attr('value', numberWithCommas(viewedNumber));
        if (digits.length === operators.length && digits.length > 0) {
            expression = "";
            for (let i = 0; i < digits.length; i++) {
                expression = expression + digits[i] + " " + operators[i] + " ";
            }
        }
        $("#exp-view").attr( 'value', expression);

    });

}